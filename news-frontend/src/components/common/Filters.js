
import React, { useEffect, useRef } from 'react';
import { TextField, MenuItem, Grid } from '@mui/material';

const Filters = React.memo(({ filters, setFilters, sources, categories }) => {
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [filters.search]);

  const handleChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  return (
    <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
      <Grid item xs={12} sm={3}>
        <TextField
          inputRef={searchInputRef}
          fullWidth
          label="Search"
          variant="outlined"
          value={filters.search}
          onChange={handleChange('search')}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          select
          label="Source"
          variant="outlined"
          value={filters.source}
          onChange={handleChange('source')}
        >
          <MenuItem value="">All Sources</MenuItem>
          {sources.map((src, index) => (
            <MenuItem key={index} value={src}>
              {src}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          select
          label="Category" 
          variant="outlined"
          value={filters.category}
          onChange={handleChange('category')}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category, index) => (
            <MenuItem key={index} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          type="date"
          label="Date"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          value={filters.date}
          onChange={handleChange('date')}
        />
      </Grid>
    </Grid>
  );
});

export default Filters;