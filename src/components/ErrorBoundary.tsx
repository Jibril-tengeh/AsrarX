// @ts-nocheck
import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    const isChunkError = 
      error.message && 
      (error.message.includes('Failed to fetch dynamically imported module') ||
       error.message.includes('Loading chunk') ||
       error.message.includes('error loading dynamically imported module'));
       
    if (isChunkError) {
      const lastReload = sessionStorage.getItem('chunk_error_reload');
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload) > 10000) {
        sessionStorage.setItem('chunk_error_reload', now.toString());
        window.location.reload();
        return { hasError: false, error: null, errorInfo: null };
      }
    }
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
              ✦
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">AsrarHub</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Une mise à jour ou un rechargement est nécessaire pour synchroniser l'affichage.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  window.location.reload();
                }}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-medium transition-all text-sm shadow-sm shadow-emerald-600/20"
              >
                Recharger l'application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
