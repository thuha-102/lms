import { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { Box, Chip, Divider, Input, Stack, SvgIcon, Typography } from '@mui/material';
import { MultiSelect } from '../../../components/multi-select';
import { useUpdateEffect } from '../../../hooks/use-update-effect';

const typeOptions = [
  {
    label: 'VIDEO',
    value: 'VIDEO'
  },
  {
    label: 'PDF',
    value: 'PDF'
  },
  {
    label: 'QUIZ',
    value: 'QUIZ'
  },
  {
    label: 'WORD',
    value: 'WORD'
  },
  {
    label: 'CODE',
    value: 'CODE'
  },
  {
    label: 'PPT',
    value: 'PPT'
  }
];

const statusOptions = [
  {
    label: 'Published',
    value: 'published'
  },
  {
    label: 'Draft',
    value: 'draft'
  }
];

const stockOptions = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Available',
    value: 'available'
  },
  {
    label: 'Out of Stock',
    value: 'outOfStock'
  }
];

export const LMManageListSearch = (props) => {
  const { onFiltersChange, ...other } = props;
  const queryRef = useRef(null);
  const [query, setQuery] = useState('');
  const [chips, setChips] = useState([]);

  const handleChipsUpdate = useCallback(() => {
    const filters = {
      name: undefined,
      type: [],
      topicId: [],
      inStock: undefined
    };

    chips.forEach((chip) => {
      switch (chip.field) {
        case 'name':
          // There will (or should) be only one chips with field "name"
          // so we can set up it directly
          filters.name = chip.value;
          break;
        case 'type':
          filters.type.push(chip.value);
          break;
        case 'topicId':
          filters.topicId.push(chip.value);
          break;
        case 'inStock':
          // The value can be "available" or "outOfStock" and we transform it to a boolean
          filters.inStock = chip.value === 'available';
          break;
        default:
          break;
      }
    });

    onFiltersChange?.(filters);
  }, [chips, onFiltersChange]);

  useUpdateEffect(() => {
    handleChipsUpdate();
  }, [chips, handleChipsUpdate]);

  const handleChipDelete = useCallback((deletedChip) => {
    setChips((prevChips) => {
      return prevChips.filter((chip) => {
        // There can exist multiple chips for the same field.
        // Filter them by value.

        return !(deletedChip.field === chip.field && deletedChip.value === chip.value);
      });
    });
  }, []);

  const handleQueryChange = useCallback((event) => {
    event.preventDefault();
    setQuery(queryRef.current?.value || '');
  }, []);

  const handleTypeChange = useCallback((values) => {
    setChips((prevChips) => {
      const valuesFound = [];

      // First cleanup the previous chips
      const newChips = prevChips.filter((chip) => {
        if (chip.field !== 'type') {
          return true;
        }

        const found = values.includes(chip.value);

        if (found) {
          valuesFound.push(chip.value);
        }

        return found;
      });

      // Nothing changed
      if (values.length === valuesFound.length) {
        return newChips;
      }

      values.forEach((value) => {
        if (!valuesFound.includes(value)) {
          const option = typeOptions.find((option) => option.value === value);

          newChips.push({
            label: 'Type',
            field: 'type',
            value,
            displayValue: option.label
          });
        }
      });

      return newChips;
    });
  }, []);

  const handleStatusChange = useCallback((values) => {
    setChips((prevChips) => {
      const valuesFound = [];

      // First cleanup the previous chips
      const newChips = prevChips.filter((chip) => {
        if (chip.field !== 'topicId') {
          return true;
        }

        const found = values.includes(chip.value);

        if (found) {
          valuesFound.push(chip.value);
        }

        return found;
      });

      // Nothing changed
      if (values.length === valuesFound.length) {
        return newChips;
      }

      values.forEach((value) => {
        if (!valuesFound.includes(value)) {
          const option = statusOptions.find((option) => option.value === value);

          newChips.push({
            label: 'TopicId',
            field: 'topicId',
            value,
            displayValue: option.label
          });
        }
      });

      return newChips;
    });
  }, []);

  const handleStockChange = useCallback((values) => {
    // Stock can only have one value, even if displayed as multi-select, so we select the first one.
    // This example allows you to select one value or "All", which is not included in the
    // rest of multi-selects.

    setChips((prevChips) => {
      // First cleanup the previous chips
      const newChips = prevChips.filter((chip) => chip.field !== 'inStock');
      const latestValue = values[values.length - 1];

      switch (latestValue) {
        case 'available':
          newChips.push({
            label: 'Stock',
            field: 'inStock',
            value: 'available',
            displayValue: 'Available'
          });
          break;
        case 'outOfStock':
          newChips.push({
            label: 'Stock',
            field: 'inStock',
            value: 'outOfStock',
            displayValue: 'Out of Stock'
          });
          break;
        default:
          // Should be "all", so we do not add this filter
          break;
      }

      return newChips;
    });
  }, []);

  // We memoize this part to prevent re-render issues
  const typeValues = useMemo(() => chips
    .filter((chip) => chip.field === 'type')
    .map((chip) => chip.value), [chips]);

  const statusValues = useMemo(() => chips
    .filter((chip) => chip.field === 'topicId')
    .map((chip) => chip.value), [chips]);

  const stockValues = useMemo(() => {
    const values = chips
      .filter((chip) => chip.field === 'inStock')
      .map((chip) => chip.value);

    // Since we do not display the "all" as chip, we add it to the multi-select as a selected value
    if (values.length === 0) {
      values.unshift('all');
    }

    return values;
  }, [chips]);

  const showChips = chips.length > 0;

  return (
    <div {...other}>
      <Stack
        alignItems="center"
        component="form"
        direction="row"
        onSubmit={handleQueryChange}
        spacing={2}
        sx={{ p: 2 }}
      >
        <SvgIcon>
          <SearchMdIcon />
        </SvgIcon>
        <Input
          disableUnderline
          fullWidth
          inputProps={{ ref: queryRef }}
          placeholder="Tìm kiếm tên tài liệu học tập"
          sx={{ flexGrow: 1 }}
          value={query}
        />
      </Stack>
      <Divider />
      {showChips
        ? (
          <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            gap={1}
            sx={{ p: 2 }}
          >
            {chips.map((chip, index) => (
              <Chip
                key={index}
                label={(
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      '& span': {
                        fontWeight: 600
                      }
                    }}
                  >
                    <>
                        <span>
                          {chip.label}
                        </span>
                      :
                      {' '}
                      {chip.displayValue || chip.value}
                    </>
                  </Box>
                )}
                onDelete={() => handleChipDelete(chip)}
                variant="outlined"
              />
            ))}
          </Stack>
        )
        : (
          <Box sx={{ p: 2.5 }}>
            <Typography
              color="text.secondary"
              variant="subtitle2"
            >
              Không có bộ lọc nào được chọn
            </Typography>
          </Box>
        )}
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        spacing={1}
        sx={{ p: 1 }}
      >
        <MultiSelect
          label="Phân loại"
          onChange={handleTypeChange}
          options={typeOptions}
          value={typeValues}
        />
        {/* <MultiSelect
          label="TopicId"
          onChange={handleStatusChange}
          options={statusOptions}
          value={statusValues}
        />
        <MultiSelect
          label="Stock"
          onChange={handleStockChange}
          options={stockOptions}
          value={stockValues}
        /> */}
      </Stack>
    </div>
  );
};

LMManageListSearch.propTypes = {
  onFiltersChange: PropTypes.func
};
