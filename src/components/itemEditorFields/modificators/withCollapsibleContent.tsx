import React from 'react';
import {Accordion, AccordionDetails, AccordionSummary} from '@mui/material';
import {IFieldRendererProps} from 'src/entries/FieldInfo';

interface Config<T> {
  defaultExpanded?: boolean;
  title: string | ((props: IFieldRendererProps<T>) => string);
}

const defaultConfig: Config<any> = {
  defaultExpanded: false,
  title: ({fieldInfo}) => fieldInfo.title ?? '',
};

export function withCollapsibleContent<T>(
  Renderer: React.ComponentType<IFieldRendererProps<T>>,
  config: Config<T> = defaultConfig
): React.ComponentType<IFieldRendererProps<T>> {
  return (props: IFieldRendererProps<T>) => {
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
