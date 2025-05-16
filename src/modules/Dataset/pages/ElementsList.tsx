import { DatasetProvider, useDatasetContext } from '../context/DatasetContext';
import { DatasetListButtons } from '../components/DatasetListButtons';
import { DatasetTable } from '../components/DatasetTable';
import PageTitle from '../../../common/components/PageTitle';
import { useParams } from 'react-router';

export function ElementsList(): JSX.Element {
  const params = useParams();
  const datasetKey = params.datasetKey || '';

  return (
    <>
      <DatasetProvider key={datasetKey} datasetKey={datasetKey}>
        <>
          <PageTitle
            title={datasetKey}
            buttonsSection={<DatasetListButtons />}
          />
          <DatasetTable datasetKey={datasetKey} />
        </>
      </DatasetProvider>
    </>
  );
}
