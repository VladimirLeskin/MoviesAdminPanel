import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react';
import {Box, Fab, FormControl, TextField} from '@mui/material';
import {Save} from '@mui/icons-material';

import {LevelEditWidgetModel} from './level-edit-widget.model';
import {ImageUpload} from 'src/components/ImageUpload/ImageUpload';
import {Image} from 'src/components/Image/Image';
import {QuestionEdit} from './components/QuestionEdit/QuestionEdit';
import {ArrayInput} from 'src/components/ArrayInput/ArrayInput';
import {IEditedLevelQuestion} from './types';

import css from './LevelEditWidget.module.scss';

const levelEditPageModel = new LevelEditWidgetModel();

const stringFields = [
  {key: 'id', title: 'Id'},
  {key: 'title', title: 'Название'},
  {key: 'description', title: 'Описание'},
  {
    key: 'type',
    title: 'Тип',
  },
  {key: 'timeForEach', title: 'Время на вопрос'},
  {key: 'totalTime', title: 'Общее время'},
];

interface Props {
  levelId?: string;
}

export const LevelEditWidget: FC<Props> = observer(({levelId}) => {
  const {levelInfo, loadLevel, updateLevel, save, defaultQuestion, isLoading} = levelEditPageModel;

  useEffect(() => {
    loadLevel(levelId);
  }, [loadLevel, levelId]);

  const updateField = useCallback(
    (id: string, value: any) => {
      updateLevel({...levelInfo, [id]: value});
    },
    [levelInfo, updateLevel]
  );

  const onQuestionsChanged = useCallback(
    (questions: IEditedLevelQuestion[]) => {
      updateLevel({...levelInfo, questions});
    },
    [levelInfo, updateLevel]
  );

  const onImageChanged = useCallback(
    (imgContent: string) => {
      updateLevel({...levelInfo, previewImagePath: imgContent, isNewImage: true});
    },
    [levelInfo, updateLevel]
  );

  return (
    <div className={css.root}>
      <Box component="form" display="flex" flexDirection="column" width="100%">
        {stringFields.map(({key, title}) => (
          <FormControl key={key} className={css.Control} size="small">
            <TextField
              label={title}
              disabled={key === 'id'}
              variant={key === 'id' ? 'filled' : 'outlined'}
              value={levelInfo[key] ?? ''}
              size="small"
              multiline={key === 'description'}
              onChange={e => updateField(key, e.target.value)}
            />
          </FormControl>
        ))}
        <div>
          <div>Картинка</div>
          <label>
            <ImageUpload src={levelInfo.previewImagePath} onChange={onImageChanged} />
            {!levelInfo.isNewImage && (
              <div className={css.ImagePreview}>
                <Image src={levelInfo.previewImagePath} className={css.img} />
              </div>
            )}
          </label>
        </div>
        <div>
          <label>Вопросы</label>
          <div>
            <ArrayInput
              inputRender={QuestionEdit}
              defaultValue={defaultQuestion}
              value={levelInfo.questions}
              onChange={onQuestionsChanged}
              keyGetter={questionKeyGetter}
            />
          </div>
        </div>
        <Fab
          onClick={save}
          className={css.SaveBtn}
          variant="extended"
          color="primary"
          disabled={isLoading}
        >
          <Save /> Сохранить
        </Fab>
      </Box>
    </div>
  );
});

function questionKeyGetter(v: IEditedLevelQuestion, index: number) {
  return v.id || v.image.id || String(index);
}
