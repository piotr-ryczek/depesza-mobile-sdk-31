import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, BackHandler } from 'react-native';

import {
  BottomSheetGroup,
  BottomSheetArticlesGroupDataItem,
  BottomSheetRegionGroupDataItem,
} from 'types';
import { useBottomSheet } from 'lib/hooks';

import BottomSheet, { BottomSheetSectionList } from '@gorhom/bottom-sheet';

import { Handle } from './handle';
import { SectionHeader } from './section-header';
import { SectionItem } from './section-item';

const windowHeight = Dimensions.get('window').height;

const keyExtractor = ({
  id,
}: BottomSheetArticlesGroupDataItem | BottomSheetRegionGroupDataItem) => id;

type BottomSheetWrapperProps = {
  groups: BottomSheetGroup[];
};

export const BottomSheetWrapper = (props: BottomSheetWrapperProps) => {
  const { groups } = props;

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['100%'], []);
  const { setBottomSheetRef, setCurrentIndex, currentIndex } = useBottomSheet();

  // Handlers

  const handleSheetChanges = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const backAction = () => {
    if (currentIndex === 0) {
      bottomSheetRef.current?.close();
      return true;
    }

    return false;
  };

  // Side Effects

  useEffect(() => {
    // @ts-ignore
    setBottomSheetRef(bottomSheetRef);
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [currentIndex]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose>
      <BottomSheetSectionList
        keyExtractor={keyExtractor}
        renderSectionHeader={SectionHeader}
        sections={groups}
        renderItem={SectionItem}
        contentContainerStyle={styles.contentContainer}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
});
