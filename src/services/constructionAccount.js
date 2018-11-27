
import request from '@/utils/request';
import { stringify } from 'qs';

export async function requestList(params) {
    return request(`/api/constructionAccount/list?${stringify(params)}`);
}
