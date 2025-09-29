'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/core/components/ui/Button';
import { SIGNIN_REDIRECT } from '@/core/constants';

interface SignInButtonProps extends React.ComponentPropsWithRef<typeof Button> {
  title?: string;
}

const SignInButton = (props: SignInButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    router.push(SIGNIN_REDIRECT);
  };

  return (
    <Button
      variant="accent"
      className="px-8"
      onClick={handleClick}
      loading={loading}
      {...props}
    >
      {props?.title || 'Sign In'}
    </Button>
  );
};

export default SignInButton;
