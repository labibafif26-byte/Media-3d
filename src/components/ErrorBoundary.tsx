/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'Terjadi kesalahan sistem.' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Volcano 3D component:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080d1a] flex items-center justify-center p-6 text-slate-100">
          <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mx-auto text-orange-500">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Terjadi Kendala Memuat Tampilan
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Sistem simulasi grafis mengalami kendala sesaat. Anda dapat memulai ulang modul pembelajaran ini.
              </p>
            </div>

            <button
              onClick={this.handleRetry}
              className="w-full py-3.5 px-6 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Muat Ulang Halaman</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
