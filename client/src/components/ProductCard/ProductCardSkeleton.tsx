import React from "react";
import ContentLoader from "react-content-loader";

const ProductCardSkeleton = (props:any) => (
  <ContentLoader 
    speed={2}
    width={300}
    height={420}
    viewBox="0 0 300 420"
    backgroundColor="#bababa"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="4" y="14" rx="20" ry="20" width="300" height="175" /> 
    <rect x="6" y="204" rx="0" ry="0" width="300" height="18" /> 
    <rect x="5" y="280" rx="15" ry="15" width="140" height="30" /> 
    <rect x="158" y="325" rx="15" ry="15" width="140" height="30" /> 
    <rect x="6" y="325" rx="15" ry="15" width="140" height="30" /> 
    <rect x="158" y="280" rx="15" ry="15" width="140" height="30" /> 
    <rect x="158" y="367" rx="7" ry="7" width="140" height="50" /> 
    <rect x="4" y="382" rx="0" ry="0" width="80" height="18" /> 
    <rect x="6" y="237" rx="0" ry="0" width="300" height="28" />
  </ContentLoader>
)

export default ProductCardSkeleton;