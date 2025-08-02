import React from 'react'
import { Button } from '../ui/button';

export default function SocialAuthButtons({ pending }: { pending: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        disabled={pending}
        type="button"
        className="w-full"
      >
        Google
      </Button>
      <Button
        variant="outline"
        disabled={pending}
        type="button"
        className="w-full"
      >
        GitHub
      </Button>
    </div>
  );
}
