import { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { Box, Chip, Divider, Input, Stack, SvgIcon, Typography } from '@mui/material';
import { MultiSelect } from '../../../components/multi-select';
import { useUpdateEffect } from '../../../hooks/use-update-effect';

const subjectOptions = [
  {
    label: 'FUNDAMENTALS',
    value: 'FUNDAMENTALS'
  },
  {
    label: 'DATA SCIENTIST',
    value: 'DATA_SCIENTIST'
  },
  {
    label: 'MACHINE LEARNING',
    value: 'MACHINE_LEARNING'
  },
  {
    label: 'DEEP LEARNING',
    value: 'DEEP_LEARNING'
  },
  {
    label: 'DATA ENGINEER',
    value: 'DATA_ENGINEER'
  },
  {
    label: 'BIG DATA ENGINEER',
    value: 'BIG_DATA_ENGINEER'
  },
];

export const TopicManageListSearch = (props) => {
  const { onFiltersChange, onSearchChange, ...other } = props;
  const queryRef = useRef(null);
  const [query, setQuery] = useState('');
  const [chips, setChips] = useState([]);

  const handleChipsUpdate = useCallback(() => {
    const filters = {
      title: undefined,
      subject: [],
    };

    chips.forEach((chip) => {
      switch (chip.field) {
        case 'title':
          filters.title = chip.value;
          break;
        case 'subject':
          filters.subject.push(chip.value);
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
    setQuery(queryRef.current?.value);
    
    onSearchChange?.(queryRef.current?.value)
  }, [onSearchChange]);

  const handleSubjectChange = useCallback((values) => {
    setChips((prevChips) => {
      const valuesFound = [];

      // First cleanup the previous chips
      const newChips = prevChips.filter((chip) => {
        if (chip.field !== 'subject') {
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
          const option = subjectOptions.find((option) => option.value === value);

          newChips.push({
            label: 'Subject',
            field: 'subject',
            value,
            displayValue: option.label
          });
        }
      });

      return newChips;
    });
  }, []);

  // const handleStatusChange = useCallback((values) => {
  //   setChips((prevChips) => {
  //     const valuesFound = [];

  //     // First cleanup the previous chips
  //     const newChips = prevChips.filter((chip) => {
  //       if (chip.field !== 'status') {
  //         return true;
  //       }

  //       const found = values.includes(chip.value);

  //       if (found) {
  //         valuesFound.push(chip.value);
  //       }

  //       return found;
  //     });

  //     // Nothing changed
  //     if (values.length === valuesFound.length) {
  //       return newChips;
  //     }

  //     values.forEach((value) => {
  //       if (!valuesFound.includes(value)) {
  //         const option = statusOptions.find((option) => option.value === value);

  //         newChips.push({
  //           label: 'Status',
  //           field: 'status',
  //           value,
  //           displayValue: option.label
  //         });
  //       }
  //     });

  //     return newChips;
  //   });
  // }, []);

  // const handleStockChange = useCallback((values) => {
  //   // Stock can only have one value, even if displayed as multi-select, so we select the first one.
  //   // This example allows you to select one value or "All", which is not included in the
  //   // rest of multi-selects.

  //   setChips((prevChips) => {
  //     // First cleanup the previous chips
  //     const newChips = prevChips.filter((chip) => chip.field !== 'inStock');
  //     const latestValue = values[values.length - 1];

  //     switch (latestValue) {
  //       case 'available':
  //         newChips.push({
  //           label: 'Stock',
  //           field: 'inStock',
  //           value: 'available',
  //           displayValue: 'Available'
  //         });
  //         break;
  //       case 'outOfStock':
  //         newChips.push({
  //           label: 'Stock',
  //           field: 'inStock',
  //           value: 'outOfStock',
  //           displayValue: 'Out of Stock'
  //         });
  //         break;
  //       default:
  //         // Should be "all", so we do not add this filter
  //         break;
  //     }

  //     return newChips;
  //   });
  // }, []);

  // We memoize this part to prevent re-render issues
  
  const subjectValues = useMemo(() => chips
    .filter((chip) => chip.field === 'subject')
    .map((chip) => chip.value), [chips]);

  // const statusValues = useMemo(() => chips
  //   .filter((chip) => chip.field === 'status')
  //   .map((chip) => chip.value), [chips]);

  // const stockValues = useMemo(() => {
  //   const values = chips
  //     .filter((chip) => chip.field === 'inStock')
  //     .map((chip) => chip.value);

  //   // Since we do not display the "all" as chip, we add it to the multi-select as a selected value
  //   if (values.length === 0) {
  //     values.unshift('all');
  //   }

  //   return values;
  // }, [chips]);

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
          placeholder="Tìm kiếm tên chủ đề"
          onChange={(event) => setQuery(event.target.value)}
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
          onChange={handleSubjectChange}
          options={subjectOptions}
          value={subjectValues}
        />
      </Stack>
    </div>
  );
};

TopicManageListSearch.propTypes = {
  onFiltersChange: PropTypes.func
};
