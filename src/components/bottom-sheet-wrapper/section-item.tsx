import React from 'react';

import {
  BottomSheetArticlesGroupDataItem,
  BottomSheetRegionGroupDataItem,
} from 'types';
import { Region } from './region';
import { ArticlesGroup } from './articles-group';

type SectionItemProps = {
  item: BottomSheetArticlesGroupDataItem | BottomSheetRegionGroupDataItem;
};

export const SectionItem = (props: SectionItemProps) => {
  const { item } = props;
  const { type } = item;

  switch (type) {
    case 'region':
      return <Region region={item as BottomSheetRegionGroupDataItem} />;
    case 'app':
      return <ArticlesGroup group={item as BottomSheetArticlesGroupDataItem} />;
    default:
      return null;
  }
};
