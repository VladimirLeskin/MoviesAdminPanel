import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Fab,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
} from '@mui/material';
import {Save} from '@mui/icons-material';

import {LevelEditWidgetModel} from './level-edit-widget.model';
import {ImageUpload} from 'src/components/ImageUpload/ImageUpload';
import {Image} from 'src/components/Image/Image';
import {QuestionEdit} from './components/QuestionEdit/QuestionEdit';
import {ArrayInput} from 'src/components/ArrayInput/ArrayInput';
import {IEditedLevelInfo, IEditedLevelQuestion} from './types';
import {DescriptionForm} from 'src/components/MultiLangForm/MultiLangForm';

import css from './LevelEditWidget.module.scss';

const levelEditPageModel = new LevelEditWidgetModel();

const stringFields = [
  {key: 'id', title: 'Id'},
  {
    key: 'type',
    title: 'Тип',
  },
  {key: 'timeForEach', title: 'Время на вопрос'},
  {key: 'totalTime', title: 'Общее время'},
];

interface Props {
  levelId?: string;
  onSaved?: (id: string) => void;
}

export const LevelEditWidget: FC<Props> = observer(({levelId, onSaved}) => {
  const {levelInfo, loadLevel, updateLevel, save, defaultQuestion, isLoading} = levelEditPageModel;

  useEffect(() => {
    loadLevel(levelId);
  }, [loadLevel, levelId]);

  const onSave = useCallback(() => {
    save().then(id => {
      if (id) {
        onSaved?.(id);
      }
    });
  }, [onSaved, save]);

  const updateField = useCallback(
    (id: string, value: any) => {
      updateLevel({...levelInfo, [id]: value});
    },
    [levelInfo, updateLevel]
  );

  const onDescriptionsChanged = useCallback(
    (values: IEditedLevelInfo['descriptions']) => {
      updateLevel({...levelInfo, descriptions: values});
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

  const onIsActiveChanged = useCallback(
    (_, value) => {
      updateLevel({...levelInfo, isActive: value});
    },
    [levelInfo, updateLevel]
  );

  return (
    <div className={css.root}>
      <Box component="form" display="flex" flexDirection="column" width="100%">
        <FormControl className={css.Control} size="small">
          <FormControlLabel
            control={<Switch checked={levelInfo.isActive} onChange={onIsActiveChanged} />}
            label="Опубликован"
          />
        </FormControl>
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
        <ArrayInput
          inputRender={DescriptionArrayAdapter}
          defaultValue={{lang: 'ru', title: '', description: ''}}
          value={levelInfo.descriptions}
          onChange={onDescriptionsChanged}
        />
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
        <Fab onClick={onSave} className={css.SaveBtn} variant="extended" color="primary" disabled={isLoading}>
          <Save /> Сохранить
        </Fab>
      </Box>
    </div>
  );
});

function questionKeyGetter(v: IEditedLevelQuestion, index: number) {
  return v.id || v.image.id || String(index);
}

const _DESCRIPTION_STRING_FIELDS = [
  {key: 'title', title: 'Название'},
  {key: 'description', title: 'Описание'},
];

type TDescription = IEditedLevelInfo['descriptions'][0];

function DescriptionArrayAdapter({value, onChange}: {value: TDescription; onChange: (v: TDescription) => void}) {
  return (
    <Accordion className={css.Description}>
      <AccordionSummary>{[value.lang, value.title].join(': ')}</AccordionSummary>
      <AccordionDetails>
        <Box flexDirection="column" display="flex">
          <DescriptionForm info={value} onChange={onChange} stringFields={_DESCRIPTION_STRING_FIELDS} />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
