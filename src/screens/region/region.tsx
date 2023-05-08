import React, { useEffect, useReducer, useCallback } from 'react';
import { View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { BasicReducer, basicReducer } from 'lib/basic-reducer';
import { ArticlesHeaderTitle } from 'components/articles-header-title';
import api from 'lib/api';
import { Articles } from 'components/articles';
import { handleError } from 'state/actions';
import { ArticlesStackParamList } from 'navigators/articles-stack';
import { useAppDispatch } from 'lib/hooks';

type RegionScreenProps = StackScreenProps<ArticlesStackParamList, 'Region'>;

type RegionState = {
  regionTitle: string;
};

export const RegionScreen = (props: RegionScreenProps) => {
  const { navigation, route } = props;
  const {
    params: { regionId, regionTitle: regionTitleFromParams = '' },
  } = route;

  const dispatch = useAppDispatch();
  const [state, setState] = useReducer<BasicReducer<RegionState>>(
    basicReducer,
    {
      regionTitle: regionTitleFromParams,
    },
  );

  const { regionTitle } = state;

  // Handlers

  const fetchRegion = async () => {
    try {
      const { data } = await api.getRegion(regionId);

      const {
        region: { title: regionTitleFromApi },
      } = data;

      setState({
        regionTitle: regionTitleFromApi,
      });
    } catch (error) {
      dispatch(handleError(error));
    }
  };

  const apiCall = useCallback((page) => api.getRegionArticles(regionId, page), [
    regionId,
  ]);

  // Side Effects

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <ArticlesHeaderTitle title={regionTitle} />,
    });
  }, [regionTitle]);

  useEffect(() => {
    if (!regionTitleFromParams) {
      fetchRegion();
    }
  }, [regionId]);

  useEffect(() => {
    if (!regionTitleFromParams) return;

    setState({
      regionTitle: regionTitleFromParams,
    });
  }, [regionTitleFromParams]);

  return (
    <View>
      <Articles apiCall={apiCall} restart={regionId} />
    </View>
  );
};
