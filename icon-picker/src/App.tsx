// Copyright (c) 2025 S5Sajid

import {useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Theme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Divider} from '@astryxdesign/core/Divider';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Icon} from '@astryxdesign/core/Icon';
import {Spinner} from '@astryxdesign/core/Spinner';
import {Heading, Text} from '@astryxdesign/core/Text';
import {useClipboard} from '@astryxdesign/core/hooks';
import {
  borderVars,
  colorVars,
  radiusVars,
  spacingVars,
  typographyVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import {IconPicker} from './IconPicker';
import {getLucideIcon} from './lucideIconCatalog';

const styles = stylex.create({
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    paddingBlock: spacingVars['--spacing-10'],
    paddingInline: spacingVars['--spacing-6'],
  },
  container: {
    width: '100%',
    maxWidth: 560,
  },
  previewBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    flexShrink: 0,
    borderWidth: borderVars['--border-width'],
    borderStyle: 'solid',
    borderColor: colorVars['--color-border'],
    borderRadius: radiusVars['--radius-container'],
    backgroundColor: colorVars['--color-background-card'],
    color: colorVars['--color-icon-primary'],
  },
  monoValue: {
    fontFamily: typographyVars['--font-family-code'],
  },
  pushRight: {
    marginInlineStart: 'auto',
  },
});

function IconPickerDemo() {
  const [iconName, setIconName] = useState('heart-pulse');
  const {copy, isCopied} = useClipboard();
  const SelectedIcon = getLucideIcon(iconName);

  return (
    <Card width="100%">
      <VStack gap={4}>
        <IconPicker label="Icon" value={iconName} onChange={setIconName} />
        <Divider />
        <HStack gap={3} vAlign="center">
          <span {...stylex.props(styles.previewBox)}>
            {SelectedIcon ? (
              <Icon icon={SelectedIcon} size="lg" />
            ) : (
              <Spinner size="sm" />
            )}
          </span>
          <VStack gap={0.5}>
            <Text type="supporting" color="secondary">
              Value
            </Text>
            <Text xstyle={styles.monoValue}>{iconName || '—'}</Text>
          </VStack>
          <Button
            label={isCopied ? 'Copied' : 'Copy name'}
            variant="secondary"
            isDisabled={!iconName}
            onClick={() => copy(iconName)}
            xstyle={styles.pushRight}
          />
        </HStack>
      </VStack>
    </Card>
  );
}

export default function App() {
  return (
    <Theme theme={neutralTheme}>
      <main {...stylex.props(styles.page)}>
        <div {...stylex.props(styles.container)}>
          <VStack gap={6}>
            <VStack gap={2}>
              <Heading level={1}>IconPicker</Heading>
              <Text type="body" color="secondary">
                Searchable Lucide icon selector built on Astryx. Search by name,
                pick with a click or the keyboard — the value is the Lucide icon
                name.
              </Text>
            </VStack>

            <IconPickerDemo />

            <HStack gap={2}>
              <Badge variant="info" label="Astryx ComplexSelector" />
              <Badge variant="success" label="Lazy-loaded Lucide catalog" />
            </HStack>
          </VStack>
        </div>
      </main>
    </Theme>
  );
}
