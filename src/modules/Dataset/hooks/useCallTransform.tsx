import _ from 'lodash';
import { FormItem, rowData } from '../types';
import useSchema from '../../Projects/hooks/useSchema';

export interface callTransform {
  transformElements: (formItems: FormItem[], datasetName: string) => any;
}

export function useCallTransform(): callTransform {
  const { schema } = useSchema();
  let body: any = {};
  let items: any = {};

  const transformElements = (formItems: FormItem[], datasetName: string) => {
    const schemaSections = schema[datasetName];
    let form = formItems.map((item) => item.rowData);
    items = _.groupBy(form, 'column');
    getSimpleObjects();
    getObjectIDs(schemaSections);
    items = getRelationship('relationship');
    getComplexObject(items[1], body);
    getRelationshipObject(items[0]);
    return body;
  };

  const hasField = (items: any, key: any) => {
    for (const item of items) {
      if (item[key]) {
        return true;
      } else {
        return false;
      }
    }
  };

  const getRelationship = (key: any) => {
    let withRel: any[] = [];
    let withoutRel: any[] = [];
    _.forIn(items, (item: any) => {
      if (hasField(item, key)) {
        withRel.push(item);
      } else {
        withoutRel.push(item);
      }
    });
    return [withRel, withoutRel];
  };

  const getSimpleObjects = () => {
    let mainObject: any = {};
    _.forEach(items, (item: any) => {
      if (item.length == 1) {
        if (!item[0].relationship && !item[0].dateValue && !item[0].variant) {
          mainObject[item[0].column] = transformNumber(item[0].value);
          delete items[item[0].column];
        }
      }
    });
    body = mainObject;
  };

  const getObjectIDs = (schemaSections: any) => {
    let itemsCopy = items;
    _.forEach(items, (item: any, key: any) => {
      if (
        schemaSections[key]?.Type === 'ObjectID' &&
        schemaSections[key]?.ColumnType === 'PROP'
      ) {
        if (item?.length > 1) {
          const itemList: any[] = [];
          _.forEach(item, (itemData: any, key: any) => {
            body[itemData.column]?.push(itemData?.relationship);
            itemList?.push(itemData?.relationship);
          });
          body[item[0].column] = itemList;
        } else {
          body[item[0].column] = [item[0].relationship];
          delete itemsCopy[key];
        }
      }
    });
    items = itemsCopy;
  };

  const transformNumber = (value: string) => {
    let finalValue;
    if (!value) {
      return '';
    }
    const parsed = Number(value);
    if (isNaN(parsed)) {
      finalValue = value;
    } else {
      finalValue = parsed;
    }
    return finalValue;
  };

  const getRelationshipObject = (allItems: any) => {
    _.forEach(allItems, (item: any) => {
      let relItems = _.groupBy(item, 'relationship');
      _.forEach(relItems, (relItem: any, key: any) => {
        let copyRelItem = relItem;
        if (!body[relItem[0].column]) {
          body[relItem[0].column] = {};
        }
        let bodyPath = body[relItem[0].column];
        if (!bodyPath[key]) {
          bodyPath[key] = {};
        }
        let hasDateTime: boolean = false;
        let counter = 0;
        while (relItem.length > counter && !hasDateTime) {
          if (item[counter].dateValue) {
            hasDateTime = true;
          }
          counter++;
        }
        let singleValue: string | number = '';
        _.forEach(copyRelItem, (element: any) => {
          if (!element.dateValue) {
            if (!element.variant) {
              singleValue = transformNumber(element.value);
            } else {
              getOnlyVariant(element, bodyPath[key]);
            }
          } else {
            getDateTimeObject(element, bodyPath[key]);
          }
        });

        if (singleValue) {
          if (Object.keys(bodyPath[key]).length === 0) {
            bodyPath[key] = singleValue;
          } else {
            bodyPath[key]['Value'] = singleValue;
          }
        }
      });
    });
  };

  const getComplexObject = (allItems: any, bodyPath: any) => {
    _.forEach(allItems, (elements: any) => {
      let hasDateTime: boolean = false;
      let counter = 0;
      while (elements.length > counter && !hasDateTime) {
        if (elements[counter].dateValue) {
          hasDateTime = true;
        }
        counter++;
      }
      _.forEach(elements, (element: any) => {
        if (!element.dateValue) {
          getOnlyVariant(element, bodyPath);
        } else {
          getDateTimeObject(element, bodyPath);
        }
      });
    });
  };

  const getDateTimeObject = (element: rowData, bodyPart: any) => {
    if (element.variant) {
      if (Object.keys(bodyPart).includes(element.column)) {
        if (bodyPart[element.column]['DateTime']) {
          bodyPart[element.column]['Variant'] = {
            ...bodyPart[element.column]['Variant'],
            [element.variant]: {
              DateTime: { [element.dateValue]: transformNumber(element.value) },
            },
          };
          bodyPart[element.column]['DateTime'] = {
            ...bodyPart[element.column]['DateTime'],
          };
        } else {
          bodyPart[element.column]['Variant'] = {
            ...bodyPart[element.column]['Variant'],
            [element.variant]: {
              DateTime: { [element.dateValue]: transformNumber(element.value) },
            },
          };
        }
      } else {
        bodyPart[element.column] = {
          Variant: {
            [element.variant]: {
              DateTime: { [element.dateValue]: transformNumber(element.value) },
            },
          },
        };
      }
    } else {
      if (Object.keys(bodyPart).includes(element.column)) {
        if (bodyPart[element.column]['Variant']) {
          bodyPart[element.column]['Variant'] = {
            ...bodyPart[element.column]['Variant'],
            [element.variant]: {
              DateTime: { [element.dateValue]: transformNumber(element.value) },
            },
          };
          bodyPart[element.column]['DateTime'] = {
            ...bodyPart[element.column]['DateTime'],
            [element.dateValue]: transformNumber(element.value),
          };
        } else {
          bodyPart[element.column]['DateTime'] = {
            ...bodyPart[element.column]['DateTime'],
            [element.dateValue]: transformNumber(element.value),
          };
        }
      } else {
        bodyPart[element.column] = {
          DateTime: { [element.dateValue]: transformNumber(element.value) },
        };
      }
    }
  };

  const getOnlyVariant = (element: rowData, bodyPart: any) => {
    if (Object.keys(bodyPart).includes(element.column)) {
      if (bodyPart[element.column]['DateTime']) {
        bodyPart[element.column]['DateTime'] = {
          ...bodyPart[element.column]['DateTime'],
        };
        bodyPart[element.column]['Variant'] = {
          ...bodyPart[element.column]['Variant'],
          [element.variant]: transformNumber(element.value),
        };
      } else {
        bodyPart[element.column]['Variant'] = {
          ...bodyPart[element.column]['Variant'],
          [element.variant]: transformNumber(element.value),
        };
      }
    } else {
      bodyPart[element.column] = {
        Variant: { [element.variant]: transformNumber(element.value) },
      };
    }
  };
  return {
    transformElements,
  };
}
