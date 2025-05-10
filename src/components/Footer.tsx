
import React from 'react';
import { Link } from 'react-router-dom';
import ChatLogo from './ChatLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border py-8 mt-20">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <ChatLogo />
          
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/" className="text-foreground/70 hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/" className="text-foreground/70 hover:text-foreground transition-colors">Terms</Link>
            <Link to="/" className="text-foreground/70 hover:text-foreground transition-colors">Contact</Link>
          </div>
          
          <p className="text-sm text-foreground/60">
            © {currentYear} AI Chat System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
