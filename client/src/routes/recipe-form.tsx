import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { SelectTags } from "../components/tag";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { recipeService } from "../services/http-service";
import { RecipeIngredient, Tag } from "../types";
import { CloudUpload } from "@mui/icons-material";
import Delete from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { useStore } from "../state";

export const RecipeForm = () => {
  const userId = useStore((state) => state.loggedUser?._id);
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = useState({
    ingredients: [{ gramAmount: 0, ingredient: { name: "" } }],
    preperation: [""],
  } as Record<string, any>);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState<File>();

  const getRecipe = async () => {
    const recipe = await recipeService.get(`/${id}`);
    setIsLoading(false);
    if (recipe) {
      setRecipe(recipe);
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/");
    } else if (id) {
      getRecipe();
    }
  }, []);

  if (id && !recipe._id) {
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

  const handleTagSelection = (tags: string[]) => {
    setRecipe({ ...recipe, tags });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files && event.target.files[0];
    if (uploadedFile) {
      setImage(uploadedFile);
    }
  };

  const isFormValid = (): boolean => {
    return (
      recipe.name &&
      recipe.tags.length > 0 &&
      recipe.preperationTimeMinutes &&
      (recipe.image || image) &&
      recipe.ingredients.every(
        (ingredient: RecipeIngredient) =>
          ingredient.gramAmount && ingredient.ingredient.name
      ) &&
      recipe.preperation.every((step: string) => !!step)
    );
  };

  const submitForm = async () => {
    const formData = new FormData();
    formData.append("name", recipe.name);
    formData.append(
      "preperationTimeMinutes",
      recipe.preperationTimeMinutes.toString()
    );

    recipe.preperation.forEach((step: string, index: number) => {
      formData.append(`preperation[${index}]`, step);
    });

    if (image) {
      formData.append("image", image);
    }

    recipe.tags.forEach((tag: string | Tag, index: number) => {
      if (typeof tag === "string") {
        formData.append(`tags[${index}]`, tag);
      } else {
        formData.append(`tags[${index}][name]`, tag.name);
      }
    });

    if (recipe.ingredients) {
      recipe.ingredients.forEach(
        (ingredientObj: RecipeIngredient, index: number) => {
          formData.append(
            `ingredients[${index}][gramAmount]`,
            ingredientObj.gramAmount.toString()
          );

          formData.append(
            `ingredients[${index}][ingredient][name]`,
            ingredientObj.ingredient.name
          );
        }
      );
    }

    const res = id
      ? await recipeService.patch(`/${id}`, {
          // headers: { "Content-type": "multipart/form-data" },
          body: formData,
        })
      : await recipeService.post("/", {
          // headers: { "Content-type": "multipart/form-data" },
          body: formData,
        });

    if (res) {
      toast.success("Recipe uploaded successfully!");
      navigate("/");
    }
  };

  return (
    <Box>
      <Card sx={{ boxShadow: 0, maxWidth: 800, margin: "auto" }}>
        <CardContent className="flex flex-col gap-8">
          <div>
            <Typography variant="h6">
              {id ? "Edit recipe" : "Create a new recipe"} ✨
            </Typography>
          </div>

          <div>
            <Typography variant="body1" color="primary">
              It all starts with a really good name:
            </Typography>
            <FormControl
              sx={{ m: 1, width: 400 }}
              variant="outlined"
              size="small"
            >
              <OutlinedInput
                placeholder="put the name here"
                value={recipe.name}
                onChange={(e) =>
                  setRecipe({
                    ...recipe,
                    name: e.target.value,
                  })
                }
              />
            </FormControl>
          </div>

          <div>
            <Typography variant="body1" color="primary">
              Try to choose a few tags:
            </Typography>
            <SelectTags
              label="tags"
              initialTags={recipe.tags?.map((tag: Tag) => tag._id) ?? []}
              handleSelection={handleTagSelection}
            />
          </div>

          <div>
            <Typography variant="body1" color="primary">
              How long does it take to prepare?
            </Typography>
            <FormControl
              sx={{ m: 1, width: "25ch" }}
              variant="outlined"
              size="small"
            >
              <OutlinedInput
                value={recipe.preperationTimeMinutes}
                onChange={(e) =>
                  setRecipe({
                    ...recipe,
                    preperationTimeMinutes: +e.target.value,
                  })
                }
                type="number"
                endAdornment={
                  <InputAdornment position="end">minutes</InputAdornment>
                }
              />
            </FormControl>
          </div>
          <div>
            <Typography variant="body1" color="primary">
              Add a great image
            </Typography>
            <div className="flex gap-4 items-center">
              <input
                accept="image/*" // You can limit the file types
                style={{ display: "none" }}
                id="upload-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="upload-file">
                <IconButton component="span">
                  <CloudUpload fontSize="large" />
                </IconButton>
              </label>
              {(recipe.image || image) && (
                <Typography variant="body1">
                  {image?.name || recipe.image}
                </Typography>
              )}
            </div>
          </div>
          <div>
            <Typography variant="body1" color="primary">
              Ingredients:
            </Typography>
            {recipe.ingredients.map(
              (ingredient: RecipeIngredient, i: number) => (
                <IngredientForm
                  key={i}
                  ingredient={ingredient}
                  onChange={(ingredient) =>
                    setRecipe({
                      ...recipe,
                      ingredients: recipe.ingredients.map(
                        (original: RecipeIngredient, index: number) =>
                          index === i ? ingredient : original
                      ),
                    })
                  }
                  onDelete={() =>
                    setRecipe({
                      ...recipe,
                      ingredients: recipe.ingredients.filter(
                        (_: RecipeIngredient, index: number) => index !== i
                      ),
                    })
                  }
                />
              )
            )}
            <Button
              variant="contained"
              onClick={() =>
                setRecipe({
                  ...recipe,
                  ingredients: [
                    ...recipe.ingredients,
                    {
                      gramAmount: 0,
                      ingredient: { name: "" },
                    },
                  ],
                })
              }
            >
              Add more
            </Button>
          </div>

          <div>
            <Typography variant="body1" color="primary">
              Preperation steps:
            </Typography>
            {recipe.preperation.map((step: string, i: number) => (
              <PreperationStepForm
                key={i}
                step={step}
                onChange={(step) =>
                  setRecipe({
                    ...recipe,
                    preperation: recipe.preperation.map(
                      (original: string, index: number) =>
                        index === i ? step : original
                    ),
                  })
                }
                onDelete={() =>
                  setRecipe({
                    ...recipe,
                    preperation: recipe.preperation.filter(
                      (_: RecipeIngredient, index: number) => index !== i
                    ),
                  })
                }
              />
            ))}
            <Button
              variant="contained"
              onClick={() =>
                setRecipe({
                  ...recipe,
                  preperation: [...recipe.preperation, ""],
                })
              }
            >
              Add more
            </Button>
          </div>

          <div className="flex justify-end">
            <Button
              size="large"
              variant="contained"
              disabled={!isFormValid()}
              onClick={submitForm}
            >
              Done! 💁‍♀️
            </Button>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
};

const IngredientForm = ({
  ingredient,
  onChange,
  onDelete,
}: {
  ingredient: RecipeIngredient;
  onChange: (e: RecipeIngredient) => void;
  onDelete: () => void;
}) => {
  return (
    <div className="flex">
      <FormControl sx={{ m: 1, width: 150 }} variant="outlined" size="small">
        <OutlinedInput
          placeholder="amount"
          type="number"
          value={ingredient.gramAmount}
          onChange={(e) =>
            onChange({
              ...ingredient,
              gramAmount: +e.target.value,
            })
          }
          endAdornment={<InputAdornment position="end">gram</InputAdornment>}
        />
      </FormControl>
      <FormControl sx={{ m: 1, width: 400 }} variant="outlined" size="small">
        <OutlinedInput
          placeholder="Ingredient Name"
          value={ingredient.ingredient.name}
          onChange={(e) =>
            onChange({
              ...ingredient,
              ingredient: { name: e.target.value },
            })
          }
        />
      </FormControl>
      <IconButton component="span" onClick={onDelete}>
        <Delete fontSize="small" />
      </IconButton>
    </div>
  );
};

const PreperationStepForm = ({
  step,
  onChange,
  onDelete,
}: {
  step: string;
  onChange: (e: string) => void;
  onDelete: () => void;
}) => {
  return (
    <div className="flex">
      <FormControl sx={{ m: 1, width: 600 }} variant="outlined" size="small">
        <OutlinedInput
          placeholder="Preperation step"
          value={step}
          onChange={(e) => onChange(e.target.value)}
        />
      </FormControl>
      <IconButton component="span" onClick={onDelete}>
        <Delete fontSize="small" />
      </IconButton>
    </div>
  );
};
