import { useNavigate } from 'react-router-dom';
import { backButton } from '@telegram-apps/sdk-react';
import { PropsWithChildren, useEffect } from 'react';

export function Page({ children, back = true }: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   */
  back?: boolean
}>) {
  const navigate = useNavigate();

  useEffect(() => {
    if (back) {
      backButton.show();
      return backButton.onClick(() => {
        navigate(-1);
      });
    }
    backButton.hide();
  }, [back]);

  return (
    <div style={{
      height: 'calc(100vh - 82px)', // viewport height minus nav bar height
      overflowY: 'auto',           // enable scrolling when content overflows
      position: 'relative',        // establish positioning context
      paddingBottom: '1rem'        // small padding for aesthetics
    }}>
      {children}
    </div>
  );
}