import { useContext } from 'react';

import { BottomSheetContext } from 'lib/contexts/bottom-sheet';

export const useBottomSheet = () => {
  const { bottomSheetRef, setBottomSheetRef, currentIndex, setCurrentIndex } =
    useContext(BottomSheetContext);

  return {
    bottomSheetRef,
    setBottomSheetRef,
    currentIndex,
    setCurrentIndex,
  };
};
