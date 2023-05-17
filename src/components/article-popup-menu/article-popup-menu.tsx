import React, { useRef, useMemo } from 'react';
import {
  UIManager,
  findNodeHandle,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { Icon } from 'react-native-elements';

import { ACTIVE_OPACITY } from 'styles';
import { ToastType, UserRole } from 'types';
import { showToast } from 'lib/helpers';
import api from 'lib/api';
import {
  saveArticle,
  unsaveArticle,
  reportArticle,
  undoReportArticle,
  handleError,
} from 'state/actions';
import { useAppSelector, useAppDispatch } from 'lib/hooks';

type ArticlePopupMenuProps = {
  articleId: string;
  publisherId: string;
};

export const ArticlePopupMenu = (props: ArticlePopupMenuProps) => {
  const { articleId, publisherId: publishedById } = props;
  const menuRef = useRef(null);
  const dispatch = useAppDispatch();

  const { jwtToken, role, savedArticles, reportedArticles, publisherId } =
    useAppSelector((state) => state);

  const isLoggedReader = !!(jwtToken && role === UserRole.READER);
  const isLoggedPublisher = !!(jwtToken && role === UserRole.PUBLISHER);

  const handleSaveArticle = async () => {
    try {
      const { data } = await api.addArticleToRead(articleId);
      const { status } = data;

      if (status !== 'ok') {
        throw new Error('Incorrect response status.');
      }

      dispatch(saveArticle(articleId));
      showToast(ToastType.SUCCESS, 'Artykuł został zapisany.');
    } catch (error) {
      dispatch(handleError(error));
    }
  };

  const handleUnsaveArticle = async () => {
    try {
      const { data } = await api.removeArticleToRead(articleId);
      const { status } = data;

      if (status !== 'ok') {
        throw new Error('Incorrect response status.');
      }

      dispatch(unsaveArticle(articleId));
      showToast(ToastType.SUCCESS, 'Artykuł został usunięty z zapisanych.');
    } catch (error) {
      dispatch(handleError(error));
    }
  };

  const handleReportArticle = async () => {
    try {
      const { data } = await api.reportArticle(articleId);
      const { status } = data;

      if (status !== 'ok') {
        throw new Error('Incorrect response status.');
      }

      dispatch(reportArticle(articleId));
      showToast(ToastType.SUCCESS, 'Artykuł został zgłoszony.');
    } catch (error) {
      dispatch(handleError(error));
    }
  };

  const handleUndoReportArticle = async () => {
    try {
      const { data } = await api.undoReportArticle(articleId);
      const { status } = data;

      if (status !== 'ok') {
        throw new Error('Incorrect response status.');
      }

      dispatch(undoReportArticle(articleId));
      showToast(ToastType.SUCCESS, 'Cofnięto zgłoszenie artykułu.');
    } catch (error) {
      dispatch(handleError(error));
    }
  };

  const actions = useMemo(() => {
    const actionsList = [];

    // Reader
    if (isLoggedReader) {
      if (savedArticles.includes(articleId)) {
        actionsList.push({
          action: () => handleUnsaveArticle(),
          label: 'Usuń z zapisanych',
        });
      } else {
        actionsList.push({
          action: () => handleSaveArticle(),
          label: 'Zapisz',
        });
      }

      // TODO: In future
      // actionsList.push({
      //   action: () => console.log('Send to Kindle'),
      //   label: 'Wyślij na Kindle',
      // });
    }
    // Publisher
    else if (isLoggedPublisher && publishedById !== publisherId) {
      if (reportedArticles.includes(articleId)) {
        actionsList.push({
          action: () => handleUndoReportArticle(),
          label: 'Cofnij zgłoszenie',
        });
      } else {
        actionsList.push({
          action: () => handleReportArticle(),
          label: 'Zgłoś',
        });
      }
    }

    return actionsList;
  }, [savedArticles, reportedArticles, articleId, jwtToken]);

  const actionLabels = actions.map(({ label }) => label);

  const handleShowPopupError = () => {
    console.log('Show popup error');
  };

  const handlePress: (item: string, index: number | undefined) => void = async (
    _,
    actionIndex,
  ) => {
    if (actionIndex === undefined) return;

    await actions[actionIndex].action();
  };

  const handleMenuPress = () => {
    UIManager.showPopupMenu(
      // @ts-ignore
      findNodeHandle(menuRef?.current),
      actionLabels,
      handleShowPopupError,
      handlePress,
    );
  };

  if (!jwtToken || !actions.length) return null;

  return (
    <TouchableOpacity
      activeOpacity={ACTIVE_OPACITY}
      onPress={handleMenuPress}
      // style={styles.touchableContainer}
    >
      <View style={styles.iconWrapper} ref={menuRef}>
        <Icon name="ellipsis-v" size={20} color="black" type="font-awesome" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 1000,
  },
});
