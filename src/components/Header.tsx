
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import ThemeToggle from './ThemeToggle';
import ChatLogo from './ChatLogo';

const Header = () => {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto flex justify-between items-center py-4">
        <Link to="/">
          <ChatLogo />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">Features</Link>
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">Demo</Link>
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">Pricing</Link>
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">Contact</Link>
        </nav>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/register" className="hidden sm:block">
            <Button>Register</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
