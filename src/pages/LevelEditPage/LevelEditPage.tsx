import React, {FC, useCallback, useEffect} from 'react';
import {useParams} from 'react-router';
import {observer} from 'mobx-react';
import {Box, Button, FormControl, IconButton, TextField} from '@mui/material';
import {Add} from '@mui/icons-material';

import {LevelEditPageModel} from './level-edit-page.model';
import {ImageUpload} from 'src/components/ImageUpload/ImageUpload';
import {Image} from 'src/components/Image/Image';
import {QuestionEdit} from './components/QuestionEdit/QuestionEdit';
import {IEditedLevelQuestion} from './types';

import css from './LevelEditPage.module.scss';

const levelEditPageModel = new LevelEditPageModel();

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

export const LevelEditPage: FC = observer(() => {
  const params = useParams<{levelId: string}>();
  const {levelInfo, loadLevel, updateLevel, addQuestion} = levelEditPageModel;

  useEffect(() => {
    loadLevel(params.levelId);
  }, [loadLevel, params.levelId]);

  const updateField = useCallback(
    (id: string, value: any) => {
      updateLevel({...levelInfo, [id]: value});
    },
    [levelInfo, updateLevel]
  );

  const onQuestionChanged = useCallback(
    (index: number, q: IEditedLevelQuestion) => {
      const questions = [...levelInfo.questions.slice(0, index), q, ...levelInfo.questions.slice(index + 1)];
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
      <Box component="form" style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
        <Button onClick={levelEditPageModel.save}>Сохранить</Button>
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
            {levelInfo.questions.map((q, index) => (
              <QuestionEdit {...q} key={q.image.id} onChange={v => onQuestionChanged(index, v)} />
            ))}
            <IconButton onClick={addQuestion}>
              <Add />
            </IconButton>
          </div>
        </div>
      </Box>
    </div>
  );
});
