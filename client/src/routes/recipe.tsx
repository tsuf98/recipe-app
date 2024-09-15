import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { TagList } from "../components/tag";
import { API_URL, recipeService } from "../services/http-service";
import { useEffect, useState } from "react";
import { Recipe } from "../types";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStore } from "../state";
import { toast } from "react-toastify";

export const RecipePage = () => {
  const navigate = useNavigate();
  const userId = useStore((state) => state.loggedUser?._id);
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe>();
  const [isLoading, setIsLoading] = useState(true);

  const getRecipe = async () => {
    const recipe = await recipeService.get(`/${id}`);
    setIsLoading(false);
    if (recipe) {
      setRecipe(recipe);
    }
  };

  useEffect(() => {
    getRecipe();
  }, []);

  const deleteRecipe = async () => {
    const res = await recipeService.delete(`/${id}`);
    if (res) {
      toast.success("Recipe deleted successfully!");
      navigate("/");
    }
  };

  if (!recipe) {
    if (!isLoading) {
      return (
        <div className="w-full flex flex-col items-center mt-10 gap-8">
          <Typography variant="h6">No recipe found 😢</Typography>
          <Link to="/">Go back</Link>
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col items-center mt-10 gap-8">
        <CircularProgress size={100} />
        <Typography variant="h6">One moment, hang on!</Typography>
      </div>
    );
  }

  return (
    <Box className="mt-8 w-full items-center flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2">
        <Typography variant="h5">{recipe.name}</Typography>
        <Typography variant="body1">By {recipe.creator.name}</Typography>
      </div>

      <div className="flex gap-60 w-full justify-center">
        <div className="flex flex-col gap-4">
          <Typography variant="h6">Ingredients</Typography>
          <ul>
            {recipe.ingredients?.map((ingredient) => (
              <Typography variant="body1" key={ingredient._id} component="li">
                {ingredient.gramAmount}g {ingredient.ingredient.name}
              </Typography>
            ))}
          </ul>
          <Typography variant="h6" className="mt-8">
            Preperation
          </Typography>
          <div>
            {recipe.preperation?.map((step: string, i: number) => (
              <Typography variant="body1" key={i} component="li">
                {step}
              </Typography>
            ))}
          </div>
          <Typography variant="body1">Enjoy! 😋</Typography>
        </div>

        <div className="flex flex-col gap-8">
          <div
            className="rounded-md bg-center bg-cover"
            style={{
              width: 400,
              height: 400,
              backgroundImage: `url(${API_URL}/${recipe.image})`,
            }}
          />
          {recipe.tags && <TagList tags={recipe.tags} />}
        </div>
      </div>
      <div className="flex gap-8">
        <Button component={Link} to="/">
          Go back
        </Button>
        {recipe.creator._id === userId && (
          <>
            <Button component={Link} to={`/recipe/${recipe._id}/edit`}>
              Edit
            </Button>
            <Button color="error" onClick={deleteRecipe}>
              Delete
            </Button>
          </>
        )}
      </div>
    </Box>
  );
};
