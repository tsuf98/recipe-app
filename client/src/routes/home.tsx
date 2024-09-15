import { RecipeTable } from "../components/all-recipes";
import { Recommendations } from "../components/recommendations";

export const Home = () => {
  return (
    <>
      <Recommendations />
      <RecipeTable />
    </>
  );
};
