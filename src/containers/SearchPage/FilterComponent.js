import React from 'react';

import { SCHEMA_TYPE_ENUM, SCHEMA_TYPE_MULTI_ENUM } from '../../util/types';
import { constructQueryParamName } from './SearchPage.helpers';
import SelectSingleFilter from './SelectSingleFilter/SelectSingleFilter';
import SelectMultipleFilter from './SelectMultipleFilter/SelectMultipleFilter';
import BookingDateRangeFilter from './BookingDateRangeFilter/BookingDateRangeFilter';
import KeywordFilter from './KeywordFilter/KeywordFilter';
import PriceFilter from './PriceFilter/PriceFilter';

// Format single string into a format that works as query parameter
const getOptionKey = option => `${option}`.toLowerCase().replace(/\s/g, '_');
// Helper: get schemaOptions in a format that works as query parameter
const getOptions = schemaOptions =>
  schemaOptions.map(o => {
    return { key: getOptionKey(o), label: `${o}` };
  });

/**
 * FilterComponent is used to map configured filter types
 * to actual filter components
 */
const FilterComponent = props => {
  const {
    idPrefix,
    config,
    urlQueryParams,
    initialValues,
    getHandleChangedValueFn,
    ...rest
  } = props;
  // Note: config can be either
  // - listingExtendedData config or
  // - default filter config
  // They both have 'key' and 'schemaType' included.
  const { key, schemaType } = config;
  const { liveEdit, showAsPopup } = rest;

  const useHistoryPush = liveEdit || showAsPopup;
  const prefix = idPrefix || 'SearchPage';
  const componentId = `${prefix}.${key.toLowerCase()}`;
  const name = key.replace(/\s+/g, '-').toLowerCase();

  // Default filters: price, keywords, dates
  switch (key) {
    case 'price': {
      const { min, max, step, label } = config;
      return (
        <PriceFilter
          id={componentId}
          label={label}
          queryParamNames={[key]}
          initialValues={initialValues([key], liveEdit)}
          onSubmit={getHandleChangedValueFn(useHistoryPush)}
          min={min}
          max={max}
          step={step}
          {...rest}
        />
      );
    }
    case 'keywords':
      return (
        <KeywordFilter
          id={componentId}
          label={config.label}
          name={name}
          queryParamNames={[key]}
          initialValues={initialValues([key], liveEdit)}
          onSubmit={getHandleChangedValueFn(useHistoryPush)}
          {...rest}
        />
      );
    case 'dates': {
      return (
        <BookingDateRangeFilter
          id={componentId}
          label={config.label}
          queryParamNames={[key]}
          initialValues={initialValues([key], liveEdit)}
          onSubmit={getHandleChangedValueFn(useHistoryPush)}
          {...rest}
        />
      );
    }
  }

  // Custom extended data filters
  switch (schemaType) {
    case SCHEMA_TYPE_ENUM: {
      const { scope, schemaOptions, searchPageConfig } = config;
      const queryParamNames = [constructQueryParamName(key, scope)];
      return searchPageConfig.filterType === 'SelectSingleFilter' ? (
        <SelectSingleFilter
          id={componentId}
          label={searchPageConfig.label}
          queryParamNames={queryParamNames}
          initialValues={initialValues(queryParamNames, liveEdit)}
          onSelect={getHandleChangedValueFn(useHistoryPush)}
          options={getOptions(schemaOptions)}
          {...rest}
        />
      ) : (
        <SelectMultipleFilter
          id={componentId}
          label={searchPageConfig.label}
          name={name}
          queryParamNames={queryParamNames}
          initialValues={initialValues(queryParamNames, liveEdit)}
          onSubmit={getHandleChangedValueFn(useHistoryPush)}
          options={getOptions(schemaOptions)}
          schemaType={schemaType}
          {...rest}
        />
      );
    }
    case SCHEMA_TYPE_MULTI_ENUM: {
      const { scope, schemaOptions, searchPageConfig } = config;
      const { label, searchMode } = searchPageConfig;
      const queryParamNames = [constructQueryParamName(key, scope)];
      return (
        <SelectMultipleFilter
          id={componentId}
          label={label}
          name={name}
          queryParamNames={queryParamNames}
          initialValues={initialValues(queryParamNames, liveEdit)}
          onSubmit={getHandleChangedValueFn(useHistoryPush)}
          options={getOptions(schemaOptions)}
          schemaType={schemaType}
          searchMode={searchMode}
          {...rest}
        />
      );
    }
    default:
      return null;
  }
};

export default FilterComponent;
