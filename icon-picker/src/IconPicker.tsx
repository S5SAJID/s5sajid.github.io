// Copyright (c) 2025 S5Sajid

import {useEffect, useMemo, useState, type KeyboardEvent} from 'react';
import * as stylex from '@stylexjs/stylex';
import {ComplexSelector} from '@astryxdesign/core/ComplexSelector';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Icon} from '@astryxdesign/core/Icon';
import {ScrollableArea} from '@astryxdesign/core/ScrollableArea';
import {Spinner} from '@astryxdesign/core/Spinner';
import {Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {useAnnounce, useGridFocus} from '@astryxdesign/core/hooks';
import type {SizeValue} from '@astryxdesign/core/utils';
import {
  borderVars,
  colorVars,
  radiusVars,
  sizeVars,
  spacingVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import {
  getLucideIcon,
  loadLucideIconCatalog,
  type LucideIconEntry,
} from './lucideIconCatalog';

const GRID_COLUMNS = 7;
const MAX_RENDERED_ICONS = 200;
const GRID_CELL_SELECTOR = '[role="gridcell"]';

// ARIA grid rows are separate elements; `display: contents` keeps the cells
// participating in the container's CSS grid layout.
const styles = stylex.create({
  grid: {
    display: 'grid',
    gridTemplateColumns: `repeat(${GRID_COLUMNS}, ${sizeVars['--size-element-lg']})`,
    gap: spacingVars['--spacing-1'],
    justifyContent: 'space-between',
  },
  gridRow: {
    display: 'contents',
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: sizeVars['--size-element-lg'],
    height: sizeVars['--size-element-lg'],
    padding: 0,
    borderWidth: borderVars['--border-width'],
    borderStyle: 'solid',
    borderColor: colorVars['--color-border'],
    borderRadius: radiusVars['--radius-element'],
    backgroundColor: colorVars['--color-background-card'],
    color: colorVars['--color-icon-secondary'],
    cursor: 'pointer',
    ':hover': {
      '@media (hover: hover)': {
        borderColor: colorVars['--color-border-emphasized'],
        color: colorVars['--color-icon-primary'],
      },
    },
  },
  cellSelected: {
    borderColor: colorVars['--color-accent'],
    backgroundColor: colorVars['--color-accent'],
    color: colorVars['--color-on-accent'],
  },
  loadingRow: {
    justifyContent: 'center',
    paddingBlock: spacingVars['--spacing-8'],
  },
  popupContent: {
    width: 300,
  },
  triggerValue: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacingVars['--spacing-2'],
    minWidth: 0,
  },
});

function toRows<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
}

interface IconPickerPanelProps {
  value: string;
  isOpen: boolean;
  onSelect: (iconName: string) => void;
}

function IconPickerPanel({value, isOpen, onSelect}: IconPickerPanelProps) {
  const [entries, setEntries] = useState<LucideIconEntry[] | null>(null);
  const [query, setQuery] = useState('');
  const announce = useAnnounce();

  const {gridRef, handleKeyDown, handleFocus, focusCell} = useGridFocus<HTMLDivElement>({
    columns: GRID_COLUMNS,
    cellSelector: GRID_CELL_SELECTOR,
    hasRovingTabIndex: true,
  });

  useEffect(() => {
    let isSubscribed = true;
    loadLucideIconCatalog().then(catalog => {
      if (isSubscribed) {
        setEntries(catalog);
      }
    });
    return () => {
      isSubscribed = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const matchedEntries = useMemo(() => {
    if (!entries) {
      return [];
    }
    const normalizedQuery = query.trim().toLowerCase().replace(/-/g, '');
    if (!normalizedQuery) {
      return entries;
    }
    return entries.filter(entry => entry.searchKey.includes(normalizedQuery));
  }, [entries, query]);

  useEffect(() => {
    if (isOpen && entries != null) {
      announce(`${matchedEntries.length} icons`);
    }
  }, [announce, entries, isOpen, matchedEntries.length]);

  if (entries == null) {
    return (
      <HStack gap={2} vAlign="center" xstyle={styles.loadingRow}>
        <Spinner size="sm" />
        <Text type="supporting" color="secondary">
          Loading icons…
        </Text>
      </HStack>
    );
  }

  const renderedEntries = matchedEntries.slice(0, MAX_RENDERED_ICONS);
  const hiddenCount = matchedEntries.length - renderedEntries.length;

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && renderedEntries.length > 0) {
      event.preventDefault();
      focusCell(0);
    }
  };

  return (
    <VStack gap={2}>
      <TextInput
        label="Search icons"
        isLabelHidden
        placeholder="Search icons..."
        startIcon="search"
        hasClear
        value={query}
        onChange={setQuery}
        onKeyDown={handleSearchKeyDown}
      />
      <Text type="supporting" color="secondary">
        {matchedEntries.length} icon{matchedEntries.length === 1 ? '' : 's'}
      </Text>
      {matchedEntries.length === 0 ? (
        <EmptyState
          isCompact
          title="No icons found"
          description={`No icons match "${query}". Try a different search.`}
        />
      ) : (
        <>
          <ScrollableArea
            label="Icon results"
            axis="block"
            height={320}
            overscroll="contain">
            <div
              ref={gridRef}
              role="grid"
              aria-label="Icons"
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              {...stylex.props(styles.grid)}>
              {toRows(renderedEntries, GRID_COLUMNS).map((rowEntries, rowIndex) => (
                <div key={rowIndex} role="row" {...stylex.props(styles.gridRow)}>
                  {rowEntries.map((entry, columnIndex) => {
                    const flatIndex = rowIndex * GRID_COLUMNS + columnIndex;
                    const isSelected = entry.name === value;
                    return (
                      <button
                        key={entry.name}
                        type="button"
                        role="gridcell"
                        aria-label={entry.name}
                        aria-selected={isSelected || undefined}
                        title={entry.name}
                        tabIndex={isSelected || (!value && flatIndex === 0) ? 0 : -1}
                        onClick={() => onSelect(entry.name)}
                        {...stylex.props(styles.cell, isSelected && styles.cellSelected)}>
                        <Icon icon={entry.Icon} size="md" />
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </ScrollableArea>
          {hiddenCount > 0 && (
            <Text type="supporting" color="secondary">
              Showing first {MAX_RENDERED_ICONS} of {matchedEntries.length} — keep
              typing to narrow the results.
            </Text>
          )}
        </>
      )}
    </VStack>
  );
}

export interface IconPickerProps {
  /** Accessible label for the field. */
  label: string;
  /** Selected icon name in kebab-case, e.g. "arrow-up-right". Empty string = none. */
  value: string;
  /** Called with the selected icon's kebab-case name. */
  onChange?: (iconName: string) => void;
  /** Disables the picker. */
  isDisabled?: boolean;
  /** Visually hides the label while keeping it accessible. */
  isLabelHidden?: boolean;
  /** Width of the field. */
  width?: SizeValue;
}

export function IconPicker({
  label,
  value,
  onChange,
  isDisabled = false,
  isLabelHidden = false,
  width,
}: IconPickerProps) {
  // Warm the lazy catalog so the selected icon renders in the trigger as soon
  // as the chunk arrives.
  const [, setCatalogVersion] = useState(0);
  useEffect(() => {
    let isSubscribed = true;
    loadLucideIconCatalog().then(() => {
      if (isSubscribed) {
        setCatalogVersion(version => version + 1);
      }
    });
    return () => {
      isSubscribed = false;
    };
  }, []);

  const SelectedIcon = getLucideIcon(value);
  const triggerLabel =
    value && SelectedIcon ? (
      <span {...stylex.props(styles.triggerValue)}>
        <Icon icon={SelectedIcon} size="sm" color="secondary" />
        {value}
      </span>
    ) : undefined;

  return (
    <ComplexSelector<string>
      label={label}
      value={value}
      onChange={onChange}
      triggerLabel={triggerLabel}
      placeholder="Pick an icon"
      isDisabled={isDisabled}
      isLabelHidden={isLabelHidden}
      width={width}
      contentXstyle={styles.popupContent}>
      {(currentValue, changeValue, close, state) => (
        <IconPickerPanel
          value={currentValue}
          isOpen={state.isOpen}
          onSelect={iconName => {
            changeValue(iconName);
            close();
          }}
        />
      )}
    </ComplexSelector>
  );
}
