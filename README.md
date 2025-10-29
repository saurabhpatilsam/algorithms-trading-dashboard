# Algorithm Trading Dashboard

A comprehensive React-based frontend dashboard for managing and monitoring trading algorithms with real-time Supabase integration.

## Features

### Trading Algorithms
1. **Hedge Algorithm** - Dual account hedging strategy with configurable parameters
2. **Nine Point Opening Range** - First hour breakout strategy with automated order placement

### Key Capabilities
- **Real-time Data Integration** - Connected to Supabase for live market data
- **Multi-Account Management** - Select and manage multiple trading accounts
- **Algorithm Control** - Start/stop algorithms with custom parameters
- **Live Monitoring** - Track orders, signals, and algorithm status
- **Beautiful UI** - Built with Shadcn UI components and Tailwind CSS

## Tech Stack

- **Frontend**: React with TypeScript
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Hooks
- **Data Fetching**: Tanstack Query

## Installation

1. Clone the repository:
```bash
git clone https://github.com/saurabhpatilsam/algorithms-trading-dashboard.git
cd algorithms-trading-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm start
```

## Algorithm Configuration

### Hedge Algorithm Parameters
- **Instrument**: Trading symbol (e.g., ESZ5, NQZ5)
- **Account A/B**: Select two different accounts for hedging
- **Direction**: Long/Short for Account A (Account B takes opposite)
- **Quantity**: Number of contracts
- **Entry Price**: Initial entry price
- **TP/SL Distance**: Take profit and stop loss distances
- **Hedge Distance**: Price separation between accounts

### Nine Point Algorithm Parameters
- **Instrument**: Trading symbol
- **Points Spacing**: Distance between order levels (default 9 points)
- **Max Orders Per Side**: Maximum orders above/below range
- **Stop Loss/Take Profit Points**: Risk management parameters
- **Quantity Per Order**: Contracts per order

## Dashboard Features

### Main Dashboard
- Algorithm status monitoring
- Account overview
- Recent orders and signals
- Performance metrics

### Account Management
- View all available accounts from Supabase
- Select single or multiple accounts
- Real-time account status
- Balance information

### Live Data Integration
- Fetches 30-minute candle data from Supabase
- Calculates first hour high/low for Nine Point strategy
- Real-time order and signal updates
- WebSocket subscriptions for live data

## Project Structure

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── algorithms/       # Algorithm-specific components
│   ├── dashboard/        # Dashboard components
│   ├── layout/          # Layout components
│   └── common/          # Shared components
├── services/            # API and Supabase services
├── lib/                 # Utility functions
└── App.tsx             # Main application component
```

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (one-way operation)

## Security Notes

- Never commit `.env` files with sensitive keys
- Use environment variables for all API keys
- Implement proper authentication before production use
- Validate all user inputs before processing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Author

Created by the ORCA Trading System team

## Acknowledgments

- Shadcn UI for beautiful components
- Supabase for real-time database
- React team for the amazing framework
