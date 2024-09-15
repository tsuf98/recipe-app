import { Button, Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { recipeService } from "../services/http-service";
import { SelectTags, TagList } from "./tag";
import { Link } from "react-router-dom";

export const RecipeTable = () => {
  const [recepies, setRecepies] = useState([]);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 250 },
    {
      field: "preperationTimeMinutes",
      headerName: "Preperation Time (minutes)",
      type: "number",
      flex: 1,
      align: "center",
    },
    {
      field: "tags",
      headerName: "Tags",
      sortable: false,
      renderCell: (params) => (
        <div className="flex flex-col justify-center mt-2">
          <TagList tags={params.value} />
        </div>
      ),
      filterable: false,
      flex: 2,
    },
    {
      field: "creator",
      headerName: "Creator",
      valueGetter: (value: { name: string }) => value.name,
      flex: 1,
    },

    {
      field: "_id",
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Button
          component={Link}
          to={`recipe/${params.value}`}
          variant="outlined"
        >
          To the recipe! 🧑‍🍳
        </Button>
      ),
      flex: 1,
    },
  ];

  const getRecepies = async (selectedTags: string[] = []) => {
    if (selectedTags.length) {
      const queryString = selectedTags
        .map((tag) => `tags[]=${encodeURIComponent(tag)}`)
        .join("&");

      setRecepies(await recipeService.get(`?${queryString}`));
    } else {
      setRecepies(await recipeService.get("/"));
    }
  };

  useEffect(() => {
    getRecepies();
  }, []);

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <div className="mt-8">
      <div className="flex gap-2 items-center">
        <Typography variant="h6">All recepies</Typography>
        <SelectTags
          label="Filter by tags"
          initialTags={[]}
          handleSelection={(selected) => getRecepies(selected)}
        />
      </div>
      <Paper sx={{ height: 400 }} className="m-8 mt-4">
        <DataGrid
          rows={recepies}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
};
