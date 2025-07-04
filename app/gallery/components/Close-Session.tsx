import { LogOut } from 'lucide-react';
import type { FC } from 'react';
import { Form } from 'react-router';
import { Button } from '~/components/ui/button';

export const CloseSession: FC = () => {
  return (
    <div className="p-4 border-t w-full">
      <Form method="post" action="/auth/logout">
        {/* <input type="hidden" name="redirectTo" value="/auth" /> */}
        <Button type="submit" className="w-full cursor-pointer" variant="outline" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </Form>
    </div>
  );
};
