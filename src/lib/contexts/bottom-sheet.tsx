import React, { createContext, useState, useRef, ReactNode } from 'react';

export const BottomSheetContext = createContext({
  bottomSheetRef: null,
  setBottomSheetRef: null,
  currentIndex: -1,
  setCurrentIndex: null,
});

export const BottomSheetConsumer = BottomSheetContext.Consumer;

type BottomSheetProviderProps = {
  children: ReactNode;
};

export const BottomSheetProvider = (props: BottomSheetProviderProps) => {
  const { children } = props;

  const [bottomSheetRef, setBottomSheetRef] = useState();
  const [currentIndex, setCurrentIndex] = useState(-1);

  return (
    // @ts-ignore
    <BottomSheetContext.Provider
      value={{
        bottomSheetRef,
        setBottomSheetRef,
        currentIndex,
        setCurrentIndex,
      }}>
      {children}
    </BottomSheetContext.Provider>
  );
};
