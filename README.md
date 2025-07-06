# ASD Accessible Website

A comprehensive, accessible website designed to support individuals with Autism Spectrum Disorder (ASD) and their families. The platform provides learning resources, tools, and community support in an inclusive, neurodiversity-friendly environment.

## Features

- **Learning Management System**: Structured learning paths with video, audio, and interactive content
- **User Management**: Secure authentication and user profiles
- **Admin Dashboard**: Dynamic content management and user administration
- **Healthcare Provider Directory**: Find and book appointments with specialists
- **Community Forum**: Anonymous and public discussion spaces
- **Accessibility Features**: High contrast, reduced motion, and customizable settings
- **Assessment Tools**: Self-assessment and progress tracking

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT with bcrypt
- **Deployment**: Vercel-ready

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database (Neon recommended)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd asd-accessible-website
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   DATABASE_URL="postgresql://username:password@host:port/database"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-key"
   ```

4. **Set up the database**

   ```bash
   pnpm run db:setup
   ```

5. **Start the development server**

   ```bash
   pnpm run dev
   ```

6. **Access the application**
   - Main site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin
   - Login: admin@supportspace.org / password

## Database Setup

The application uses PostgreSQL with the following main tables:

- `users` - User accounts and authentication
- `learning_categories` - Content categories
- `learning_paths` - Learning content
- `lessons` - Individual lessons within paths
- `healthcare_providers` - Provider directory
- `appointments` - Booking system
- `community_posts` - Forum discussions
- `user_progress` - Learning progress tracking

## Admin Dashboard

The admin dashboard provides:

- **Content Management**: Create, edit, and publish learning paths
- **User Management**: View and manage user accounts
- **Real-time Statistics**: User counts and content metrics
- **Dynamic Forms**: Add new content with validation

### Admin Features

- Create new learning paths with categories
- Publish/unpublish content
- Delete content with confirmation
- View user statistics
- Manage user accounts

## Development

### Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── ...                # Other pages
├── components/            # Reusable UI components
├── lib/                   # Utility functions and database
├── scripts/               # Database setup scripts
└── public/                # Static assets
```

### Key Components

- **Admin Dashboard**: Dynamic content management interface
- **Authentication**: Secure login/register with JWT
- **Database Layer**: PostgreSQL with Neon integration
- **UI Components**: Accessible Radix UI components

### Running Tests

```bash
pnpm run lint
```

### Building for Production

```bash
pnpm run build
pnpm run start
```

## Accessibility

This application is built with accessibility in mind:

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Reduced motion options
- Customizable font sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
