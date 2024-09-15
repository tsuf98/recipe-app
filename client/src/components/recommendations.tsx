import { useEffect, useState } from "react";
import { API_URL, recipeService } from "../services/http-service";
import { Recipe } from "../types";
import { Box, Button, Typography } from "@mui/material";
import { TagList } from "./tag";
import { Link } from "react-router-dom";

const Recommendation = ({ recipe }: { recipe: Recipe }) => {
  return (
    <Box className="mt-4 flex flex-col gap-4" sx={{ width: 400 }}>
      <Typography variant="h5">{recipe.name}</Typography>

      <div className="flex gap-4">
        <div
          className="h-48 w-48 rounded-md bg-center bg-cover"
          style={{ backgroundImage: `url(${API_URL}/${recipe.image})` }}
        />
        <ul>
          {recipe.ingredients?.slice(0, 8).map((ingredient) => (
            <Typography variant="body1" key={ingredient._id} component="li">
              {ingredient.gramAmount}g {ingredient.ingredient.name}
            </Typography>
          ))}
        </ul>
      </div>
      {recipe.tags && <TagList tags={recipe.tags} />}
      <Button
        variant="contained"
        component={Link}
        to={`recipe/${recipe._id}`}
        size="large"
      >
        To the recipe! 🧑‍🍳
      </Button>
    </Box>
  );
};

export const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  useEffect(() => {
    const getRecommendations = async () => {
      setRecommendations(await recipeService.get("/reccommended"));
    };

    getRecommendations();
  }, []);
  return (
    <div>
      <Typography variant="h6">Recommended for you 👀</Typography>

      <div className="flex justify-center gap-40">
        {recommendations.map((r: Recipe) => (
          <Recommendation key={r._id} recipe={r} />
        ))}
      </div>
    </div>
  );
};
