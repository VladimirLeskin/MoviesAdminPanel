import React from 'react';
import {Accordion, AccordionDetails, AccordionSummary} from '@mui/material';
import {IFieldInfo, IFieldRendererProps} from 'src/entries/FieldInfo';

interface Config<T> {
  defaultExpanded?: boolean;
  title: string | ((props: IFieldRendererProps<T>) => string);
}

const defaultConfig: Config<any> = {
  defaultExpanded: false,
  title: ({fieldInfo}) => fieldInfo.title ?? '',
};

export function withCollapsibleContent<T, TFieldInfo extends IFieldInfo<T>>(
  Renderer: React.ComponentType<IFieldRendererProps<T, TFieldInfo>>,
  config: Config<T> = defaultConfig
): React.ComponentType<IFieldRendererProps<T, TFieldInfo>> {
  return (props: IFieldRendererProps<T, TFieldInfo>) => {
    return (
      <Accordion defaultExpanded={config.defaultExpanded}>
        <AccordionSummary>{typeof config.title === 'string' ? config.title : config.title(props)}</AccordionSummary>
        <AccordionDetails>
          <Renderer {...props} />
        </AccordionDetails>
      </Accordion>
    );
  };
}
