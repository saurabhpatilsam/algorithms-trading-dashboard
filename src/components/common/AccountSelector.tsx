import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Check, X, Users, RefreshCw } from 'lucide-react';
import algorithmsService from '../../services/algorithms';
import { Account } from '../../services/supabase';

interface AccountSelectorProps {
  selectedAccounts: string[];
  onAccountsChange: (accounts: string[]) => void;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({ 
  selectedAccounts, 
  onAccountsChange 
}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const data = await algorithmsService.fetchAccounts();
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccount = (accountId: string) => {
    if (selectedAccounts.includes(accountId)) {
      onAccountsChange(selectedAccounts.filter(id => id !== accountId));
    } else {
      onAccountsChange([...selectedAccounts, accountId]);
    }
  };

  const selectAll = () => {
    onAccountsChange(accounts.map(acc => acc.id));
  };

  const clearAll = () => {
    onAccountsChange([]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Account Selection
            </CardTitle>
            <CardDescription>
              Select accounts to execute trades on
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAccounts}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Available Accounts ({accounts.length})</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAll}
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
              >
                Clear All
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading accounts...
            </div>
          ) : accounts.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No accounts found. Please check your Supabase connection.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedAccounts.includes(account.id)
                      ? 'bg-primary/10 border-primary'
                      : 'bg-card hover:bg-secondary/50 border-border'
                  }`}
                  onClick={() => toggleAccount(account.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {account.master_account} ({account.account_type})
                      </p>
                      {account.cash_balance && (
                        <p className="text-sm mt-1">
                          Balance: ${parseFloat(account.cash_balance.toString()).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={account.active ? 'success' : 'secondary'}>
                        {account.active ? 'active' : 'inactive'}
                      </Badge>
                      {selectedAccounts.includes(account.id) ? (
                        <Check className="h-5 w-5 text-primary" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedAccounts.length > 0 && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {selectedAccounts.length} account{selectedAccounts.length !== 1 ? 's' : ''} selected
                </p>
                <Badge variant="outline">
                  Trades will execute on all selected accounts
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSelector;
