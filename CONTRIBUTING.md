# Contributing to Kaguya Music Bot

Thank you for your interest in contributing to Kaguya Music Bot! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Use the bug report template** when creating new issues
3. **Provide detailed information** including:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node.js version)
   - Error messages or logs

### Suggesting Features

1. **Check existing feature requests** first
2. **Describe the feature** clearly and concisely
3. **Explain the use case** and benefits
4. **Consider implementation complexity**

### Code Contributions

#### Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/Kagyua-music-bot-discord-.git
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Guidelines

- **Follow existing code style** and patterns
- **Add comments** for complex logic
- **Test your changes** thoroughly
- **Update documentation** if needed

#### Code Style

- Use **camelCase** for variables and functions
- Use **PascalCase** for classes
- Use **meaningful names** for variables and functions
- Keep functions **small and focused**
- Add **JSDoc comments** for public methods

#### Testing

Before submitting:

1. **Test bot connection**
   ```bash
   node test-bot.js
   ```

2. **Test core functionality**
   - Play command with search
   - Play command with YouTube URL
   - Queue management
   - Volume control

3. **Test error handling**
   - Invalid URLs
   - Network issues
   - Permission errors

#### Submitting Changes

1. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature description"
   ```

2. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**
   - Use a clear title and description
   - Reference related issues
   - Include screenshots if applicable

## 📋 Development Setup

### Prerequisites

- Node.js 16.9.0+
- FFmpeg installed
- Discord Bot Token
- Git

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Add your tokens to .env
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
├── src/
│   ├── MusicManager.js     # Core music functionality
│   └── SpotifyService.js   # Spotify API integration
├── config.js               # Configuration management
├── index.js               # Main bot entry point
├── test-bot.js            # Connection testing
└── package.json           # Dependencies and scripts
```

## 🔧 Key Components

### MusicManager
- Handles music playback
- Manages queues
- Audio processing with FFmpeg

### SpotifyService
- Spotify API integration
- Track/playlist resolution
- Authentication handling

### Main Bot (index.js)
- Discord event handling
- Command processing
- Error management

## 📝 Commit Message Guidelines

Use conventional commit format:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

Examples:
```
feat: add playlist shuffle command
fix: resolve audio streaming issues
docs: update installation guide
```

## 🚀 Release Process

1. **Version bump** in package.json
2. **Update CHANGELOG.md**
3. **Create release tag**
4. **Publish release notes**

## ❓ Questions?

- **Create an issue** for general questions
- **Check existing documentation** first
- **Be specific** about your question or problem

## 📜 Code of Conduct

- **Be respectful** and inclusive
- **Help others** learn and contribute
- **Focus on constructive feedback**
- **Follow project guidelines**

Thank you for contributing to Kaguya Music Bot! 🎵