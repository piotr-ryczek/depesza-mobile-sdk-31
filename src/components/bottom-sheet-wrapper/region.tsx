import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { Icon } from 'react-native-elements';

import { AppState } from 'state/app-state';
import { useBottomSheet, useAppDispatch, useAppSelector } from 'lib/hooks';
import {
  BottomSheetRegionGroupDataItem,
  UserRole,
  ToastType,
  ThumbnailSize,
} from 'types';
import { followRegion, unfollowRegion, handleError } from 'state/actions';
import api from 'lib/api';
import { getCurrentRoute, getImageUrl, showToast } from 'lib/helpers';
import { ACTIVE_OPACITY } from 'styles';

import { itemStyles } from './styles';

type RegionProps = {
  region: BottomSheetRegionGroupDataItem;
};

export const Region = (props: RegionProps) => {
  const { region } = props;
  const { bottomSheetRef } = useBottomSheet();
  const navigation = useNavigation();
  const currentRoute = useNavigationState(getCurrentRoute); // TODO: Should all logic be moved upper to ArticlesStack
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const { jwtToken, role, followedRegions } = useAppSelector(
    (state: AppState) => state,
  ); // TODO: Also should be moved upper to ArticlesStack

  const { title, id, iconUrl } = region;
  const isLoggedReader = !!(jwtToken && role === UserRole.READER);
  const isFollowed =
    followedRegions && followedRegions.length && followedRegions.includes(id);
  const isFocused =
    currentRoute.name === 'Region' && currentRoute.params?.regionId === id;

  // Handlers

  const handleGoToRegion = () => {
    // @ts-ignore
    bottomSheetRef.current.close();

    setTimeout(
      () => navigation.navigate('Region', { regionId: id, regionTitle: title }),
      0,
    );
  };

  const handleFollow = async () => {
    setIsLoading(true);

    try {
      await api.followRegion(id);
      dispatch(followRegion(id));

      setIsLoading(false);

      showToast(ToastType.SUCCESS, `Zaobserwowano ${title}.`);
    } catch (error) {
      setIsLoading(false);
      dispatch(handleError(error));
    }
  };

  const handleUnfollow = async () => {
    setIsLoading(true);

    try {
      await api.unfollowRegion(id);
      dispatch(unfollowRegion(id));

      setIsLoading(false);

      showToast(ToastType.SUCCESS, `Zakończono obserwowanie ${title}.`);
    } catch (error) {
      setIsLoading(false);
      dispatch(handleError(error));
    }
  };

  return (
    <View style={styles.wrapper}>
      {isLoading && (
        <View style={styles.loadingIconWrapper}>
          <ActivityIndicator size={20} color="black" />
        </View>
      )}
      <View style={[styles.container, isLoading && styles.containerLoading]}>
        <TouchableOpacity
          activeOpacity={ACTIVE_OPACITY}
          style={styles.anchorWrapper}
          onPress={handleGoToRegion}
          disabled={isLoading}>
          <View style={styles.anchor}>
            <Image
              source={{
                uri: getImageUrl(iconUrl, ThumbnailSize.FULL),
              }}
              resizeMode="contain"
              style={styles.iconBackground}
            />
            <View>
              <Text style={[styles.title, isFocused && styles.titleFocused]}>
                {title}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {isLoggedReader && (
          <TouchableOpacity
            activeOpacity={ACTIVE_OPACITY}
            onPress={isFollowed ? handleUnfollow : handleFollow}
            disabled={isLoading}>
            <Icon
              name={isFollowed ? 'heartbeat' : 'heart-o'}
              size={24}
              color={isFollowed ? '#D43408' : 'black'}
              type="font-awesome"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginBottom: 8,
    position: 'relative',
  },
  loadingIconWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  containerLoading: {
    opacity: 0.3,
  },
  anchorWrapper: {
    flex: 1,
  },
  anchor: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconBackground: {
    width: 48,
    height: 48,
    marginRight: 10,
  },
  ...itemStyles,
});
