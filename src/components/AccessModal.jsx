
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AccessModal = ({ isOpen, onClose }) => {
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "🚧 Access Request Submitted",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-purple-950 to-black border-2 border-purple-700/50 shadow-2xl shadow-purple-500/30 max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600/30 to-amber-600/30 border-2 border-purple-500/50">
            <Lock className="w-8 h-8 text-amber-300" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-amber-300 to-purple-300 bg-clip-text text-transparent">
            Request Bedroom Access
          </DialogTitle>
          <DialogDescription className="text-purple-200 text-center">
            Fill out the form below to request access to the exclusive private live feed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-purple-200 flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              required
              className="bg-purple-950/50 border-purple-700/50 text-white placeholder:text-purple-400 focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-purple-200 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              className="bg-purple-950/50 border-purple-700/50 text-white placeholder:text-purple-400 focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-purple-200">
              Reason for Access
            </Label>
            <textarea
              id="reason"
              rows="3"
              placeholder="Tell us why you'd like access..."
              className="w-full px-3 py-2 rounded-md bg-purple-950/50 border border-purple-700/50 text-white placeholder:text-purple-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-purple-700/50 text-purple-200 hover:bg-purple-900/50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold transition-all duration-300"
            >
              Submit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccessModal;
