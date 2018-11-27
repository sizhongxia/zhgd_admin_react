
import request from '@/utils/request';

export async function requestTargetData() {
  return request('/api/fake_chart_data');
}

export async function requestConstructionPlantAccountTableData(params) {
  return request('/api/constructionPlan/accountData', {
    method: 'POST',
    body: params,
  });
}
