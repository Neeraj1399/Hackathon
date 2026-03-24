import React from 'react';

export const Skeleton = ({ className, variant = 'rect' }) => {
  const baseClasses = "animate-pulse bg-slate-200/60 transition-all";
  const roundedClasses = variant === 'circle' ? "rounded-full" : "rounded-2xl";
  
  return <div className={`${baseClasses} ${roundedClasses} ${className}`} />;
};

export const CircularLoading = ({ size = 'md', label = 'Processing...' }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  const borderSizes = {
    sm: "border-2",
    md: "border-[3px]",
    lg: "border-[5px]"
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center ${size === 'sm' ? 'p-0 gap-0' : 'p-8 space-y-5'}`}>
      <div className="relative">
        {/* Outer subtle ring */}
        <div className={`${sizeClasses[size]} ${borderSizes[size]} border-slate-100 rounded-full`} />
        {/* Active spinning ring */}
        <div className={`absolute inset-0 ${sizeClasses[size]} ${borderSizes[size]} border-transparent border-t-brand-primary rounded-full animate-spin transition-all`} />
        {/* Inner glow */}
        <div className={`absolute inset-0 ${sizeClasses[size]} bg-brand-primary/5 rounded-full blur-xl animate-pulse-slow`} />
      </div>
      {label && (
        <p className="text-[10px] sm:text-[11px] font-black text-brand-muted uppercase tracking-[0.25em] animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
};

export const LoadingOverlay = ({ label }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full bg-white/40 backdrop-blur-[1px] rounded-[2.5rem] border border-brand-border/20">
      <CircularLoading size="lg" label={label} />
    </div>
  );
};

export const CardSkeleton = ({ count = 1 }) => {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className="bg-white border border-brand-border rounded-3xl p-6 space-y-4 animate-pulse">
      <div className="flex items-center gap-4">
        <Skeleton variant="circle" className="w-10 h-10 shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-2 w-1/2" />
        </div>
      </div>
      <div className="pt-4 border-t border-brand-border/30 flex justify-between items-center">
        <Skeleton className="h-4 w-20 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
    </div>
  ));
};

export const HackathonCardSkeleton = ({ count = 1 }) => {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className="bg-white border border-brand-border rounded-[2rem] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-pulse">
      <div className="flex items-center gap-6">
        <Skeleton variant="circle" className="w-14 h-14 shrink-0" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-2.5 w-64" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full sm:w-auto">
        <div className="space-y-2 w-24">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
    </div>
  ));
};
