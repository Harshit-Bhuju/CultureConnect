import React from "react";
import CategoryPageLayout from "./components/CategoryPageLayout";

const TraditionalClothing = () => {
  return (
    <CategoryPageLayout
      category="cultural-clothes"
      title="Traditional Clothing"
      description="Authentic cultural attire from local artisans."
      showAudienceFilter={true}
    />
  );
};

export default TraditionalClothing;
