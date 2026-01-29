const LoadingSkeleton = () => {
  return (
    <div className="card">
      <div className="skeleton w-full h-48"></div>
      <div className="p-4">
        <div className="skeleton h-4 w-24 mb-2"></div>
        <div className="skeleton h-6 w-full mb-2"></div>
        <div className="skeleton h-6 w-3/4 mb-3"></div>
        <div className="skeleton h-4 w-full mb-2"></div>
        <div className="skeleton h-4 w-2/3"></div>
      </div>
    </div>
  );
};

export const NewsGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <LoadingSkeleton key={i} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
