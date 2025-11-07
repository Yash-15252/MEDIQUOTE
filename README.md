# MEDIQUOTE

A comprehensive Request for Quote (RFQ) and bidding platform built with Django REST Framework backend and React frontend, designed to streamline supplier interactions and competitive bidding processes.

## Features

- **Supplier Management**: Register and manage supplier profiles
- **RFQ Creation**: Create detailed requests for quotes with specifications
- **Competitive Bidding**: Suppliers can submit competitive bids on RFQs
- **Real-time Dashboard**: Interactive React frontend for bid management
- **RESTful API**: Full API support for all operations
- **WhatsApp Alerts**: Integrated notifications for bid updates and RFQ status changes (planned)

## Tech Stack

### Backend
- **Django** - Web framework
- **Django REST Framework** - API development
- **SQLite** - Database (development)
- **Python 3.11+**

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Scripts** - Build tooling

## Getting Started

### Prerequisites
- Python 3.11 or higher
- Node.js 16 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yash-15252/MEDIQUOTE.git
   cd MEDIQUOTE
   ```

2. **Backend Setup**
   ```bash
   # Install Python dependencies
   pip install -r requirements.txt

   # Run migrations
   python manage.py migrate

   # Start the Django server
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   cd frontend

   # Install dependencies
   npm install

   # Start the React development server
   npm start
   ```

4. **Access the Application**
   - Backend API: http://localhost:8000
   - Frontend: http://localhost:3000

## API Endpoints

### Suppliers
- `GET /api/suppliers/` - List all suppliers
- `POST /api/suppliers/` - Create new supplier
- `GET /api/suppliers/{id}/` - Get supplier details
- `PUT /api/suppliers/{id}/` - Update supplier
- `DELETE /api/suppliers/{id}/` - Delete supplier

### RFQs
- `GET /api/rfqs/` - List all RFQs
- `POST /api/rfqs/` - Create new RFQ
- `GET /api/rfqs/{id}/` - Get RFQ details
- `PUT /api/rfqs/{id}/` - Update RFQ
- `DELETE /api/rfqs/{id}/` - Delete RFQ

### Bids
- `GET /api/bids/` - List all bids
- `POST /api/bids/` - Submit new bid
- `GET /api/bids/{id}/` - Get bid details
- `PUT /api/bids/{id}/` - Update bid
- `DELETE /api/bids/{id}/` - Delete bid

## Project Structure

```
MEDIQUOTE/
├── backend/                 # Django backend
│   ├── quotes/             # Main app
│   │   ├── models.py       # Database models
│   │   ├── views.py        # API views
│   │   ├── serializers.py  # Data serializers
│   │   └── admin.py        # Admin interface
│   ├── settings.py         # Django settings
│   └── urls.py             # URL routing
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.tsx         # Main component
│   │   └── ...
│   ├── public/             # Static assets
│   └── package.json        # Dependencies
├── core/                   # Django project core
├── quotes/                 # Legacy quotes app
├── manage.py               # Django management script
├── requirements.txt        # Python dependencies
└── README.md               # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Yash Khamkar - yashkhamkar2004@gmail.com

Project Link: https://github.com/Yash-15252/MEDIQUOTE
