# MIC cPanel Frontend

A modern React-based admin panel for managing Mohandes Insurance Company's content, tickets, and files.

## Features

- **Ticket Management**: Create, view, edit, and manage support tickets with activity tracking
- **Content Management**: Manage various content types including:
  - Blocks
  - Investors
  - Lines of Business (LOB)
  - Products
  - Questions/FAQ
  - Sections
- **File Manager**: Upload, organize, and manage documents and files
- **Authentication**: Secure login with protected routes
- **Two-Factor Authentication**: Enhanced security with 2FA support

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **Ant Design** - UI component library
- **React Router** - Routing
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/OmarIsmail0/mic-cpanel-frontend.git
cd mic-cpanel-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables (if needed): Create a `.env` file in the root directory with your API configuration:

```
VITE_API_BASE_URL=your_api_url_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── api/                    # API services and configuration
│   ├── services/          # Individual service modules
│   ├── client.js          # Axios client setup
│   └── config.js          # API configuration
├── components/            # Reusable React components
│   ├── ContentManager/   # Content management components
│   ├── TicketManager/    # Ticket management components
│   └── TwoFactorAuth/    # 2FA components
├── pages/                 # Page components
├── store/                 # Redux store and slices
├── constants/             # Application constants
├── hooks/                 # Custom React hooks
└── utils/                 # Utility functions
```

## API Integration

The application uses a modular API service architecture. All API calls are centralized in the `src/api` directory. See `src/api/README.md` for detailed API documentation.

## Authentication

The application uses protected routes. Users must authenticate before accessing the main dashboard. Two-factor authentication is supported for enhanced security.

## Contributing

1. Create a feature branch
2. Make your changes
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

Private - Mohandes Insurance Company

## Support

For issues and questions, please contact the development team.
