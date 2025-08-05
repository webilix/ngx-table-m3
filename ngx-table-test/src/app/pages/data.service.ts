import { Injectable } from '@angular/core';

import { Helper } from '@webilix/helper-library';
import { JalaliDateTime } from '@webilix/jalali-date-time';
import { INgxTable, INgxTableFilter, INgxTablePagination } from '@webilix/ngx-table-m3';

import { namesList } from './names';

export type DataType = 'MANAGER' | 'ADMIN' | 'USER';
export const DataInfo: {
    [key in DataType]: { title: string; icon: string; order: number; textColor?: string; iconColor: string | null };
} = {
    MANAGER: { title: 'مدیر اصلی', icon: 'badge', order: 1, textColor: 'var(--error)', iconColor: 'var(--error)' },
    ADMIN: { title: 'مدیر', icon: 'account_box', order: 2, iconColor: 'var(--secondary)' },
    USER: { title: 'عضو', icon: 'account_circle', order: 3, iconColor: null },
};

export interface IData {
    readonly type: DataType;
    readonly name: string;
    readonly mobile: string;
    readonly birthDay?: Date;
    readonly ageYear?: number;
    readonly ageDay?: any;
    readonly educationPeriod?: { from: Date; to: Date };
    readonly birthPlace?: {
        readonly state: { readonly id: string; readonly title: string };
        readonly city: { readonly id: string; readonly title: string };
    };
    readonly fileSize?: number;
    readonly description?: string | null;
    readonly weight?: number;
    readonly tag?: { id: string; title: string }[];
    readonly status: 'ACTIVE' | 'DEACTIVE';
}

type Column =
    // USER
    | 'TYPE'
    | 'NAME'
    | 'MOBILE'
    | 'STATUS'
    // BIRTH
    | 'BIRTH-DAY'
    | 'AGE-YEAR'
    | 'AGE-DAY'
    | 'STATE'
    | 'CITY'
    // OTHERS
    | 'PERIOD'
    | 'FILE-SIZE'
    | 'WEIGHT'
    | 'TAG';

@Injectable({ providedIn: 'root' })
export class DataService {
    getTable(route: string[], columns: Column[]): INgxTable<IData> {
        const table: INgxTable<IData> = {
            route,
            type: 'عضو',
            columns: [],
            rows: {
                icon: (data, index) =>
                    index % 5 === 4
                        ? { emoji: Math.random() < 0.5 ? '💻' : '🤩' }
                        : { icon: DataInfo[data.type].icon, color: DataInfo[data.type].iconColor },
                color: (data) => DataInfo[data.type].textColor,
                description: (data) => data.description,
                isDeactive: (data) => data.status === 'DEACTIVE',
            },
            actions: [
                'DIVIDER',
                {
                    type: 'ACTION',
                    title: 'مشاهده',
                    icon: 'perm_contact_calendar',
                    action: (data) => console.log('VIEW DATA', data),
                    standalone: true,
                    disableOn: (data) => data.status === 'DEACTIVE',
                },
                'DIVIDER',
                'DIVIDER',
                {
                    type: 'STATUS',
                    action: (data, active) => console.log('STATUS DATA', data, active),
                    isDeactive: (data) => data.status === 'DEACTIVE',
                },
                {
                    type: 'UPDATE',
                    action: (data) => console.log('UPDATE DATA', data),
                    disableOn: (data) => data.status === 'DEACTIVE',
                },
                { type: 'DELETE', action: (data) => console.log('DELETE DATA', data) },
                'DIVIDER',
                'DIVIDER',
                { type: 'LOG', action: (data) => console.log('VIEW DATA LOG', data) },
                'DIVIDER',
                'DIVIDER',
                'DIVIDER',
            ],
        };

        if (columns.includes('TYPE')) {
            table.columns.push({
                type: 'TEXT',
                title: 'عضویت',
                value: (data) => DataInfo[data.type].title,
                subValue: (data) => ({ value: data.type, english: true }),

                tools: {
                    id: 'type',
                    order: { type: 'DESC' },
                    filter: {
                        type: 'SELECT',
                        options: [
                            { id: 'MANAGER', title: DataInfo['MANAGER'].title },
                            { id: 'ADMIN', title: DataInfo['ADMIN'].title },
                            { id: 'USER', title: DataInfo['USER'].title },
                        ],
                    },
                },
            });
        }

        if (columns.includes('NAME')) {
            table.columns.push({
                type: 'TEXT',
                title: 'نام',
                value: 'name',
                onCopy: (data) => data.name,
                mode: 'TITLE',
                color: (data) => DataInfo[data.type].iconColor,

                tools: {
                    id: 'name',
                    order: { isDefault: true },
                    filter: { type: 'SEARCH' },
                },
            });
        }

        if (columns.includes('MOBILE')) {
            table.columns.push({
                type: 'MOBILE',
                value: 'mobile',
                english: true,
                onClick: (data) => () => alert(`MOBILE: ${data.mobile}`),

                tools: {
                    id: 'mobile',
                    filter: { type: 'SEARCH', english: true, mode: 'PHRASE' },
                },
            });
        }

        if (columns.includes('BIRTH-DAY')) {
            table.columns.push({
                type: 'DATE',
                title: 'تاریخ تولد',
                value: 'birthDay',

                tools: {
                    id: 'birthDay',
                    order: { initial: 'DESC' },
                    filter: { type: 'DATE' },
                },
            });
        }

        if (columns.includes('AGE-YEAR')) {
            table.columns.push({
                type: 'NUMBER',
                title: 'سن (سال)',
                value: 'ageYear',
                fractionDigits: 5,
                tools: { id: 'age', filter: { type: 'NUMBER' } },
            });
        }

        if (columns.includes('AGE-DAY')) {
            table.columns.push({ type: 'DURATION', title: 'سن (روز)', value: 'ageDay', format: 'DAY' });
        }

        if (columns.includes('PERIOD')) {
            table.columns.push({ type: 'PERIOD', title: 'دوره زمانی', value: 'educationPeriod' });
        }

        if (columns.includes('STATE')) {
            table.columns.push({
                type: 'TEXT',
                title: 'استان',
                value: (data) => data.birthPlace?.state.title,

                tools: {
                    id: 'state',
                    order: { type: 'ASC' },
                    filter: {
                        type: 'MULTI-SELECT',
                        options: Helper.STATE.states.map((state) => ({ id: state.id, title: state.title })),
                        maxItem: 10,
                    },
                },
            });
        }

        if (columns.includes('CITY')) {
            table.columns.push({ type: 'TEXT', title: 'شهر', value: (data) => data.birthPlace?.city.title });
        }

        if (columns.includes('FILE-SIZE')) {
            table.columns.push({ type: 'FILE-SIZE', value: 'fileSize', english: true });
        }

        if (columns.includes('WEIGHT')) {
            table.columns.push({ type: 'WEIGHT', value: 'weight' });
        }

        if (columns.includes('STATUS')) {
            table.columns.push({
                type: 'TEXT',
                title: 'وضعیت',
                value: (data) => (data.status === 'ACTIVE' ? 'فعال' : 'غیرفعال'),
                textAlign: 'LEFT',
                mode: 'SUBTITLE',

                tools: {
                    id: 'status',
                    filter: {
                        type: 'SELECT',
                        options: [
                            { id: 'ACTIVE', title: 'فعال' },
                            { id: 'DEACTIVE', title: 'غیرفعال' },
                        ],
                        maxItem: 1,
                    },
                },
            });
        }

        if (columns.includes('TAG')) {
            table.columns.push({
                type: 'TAG',
                value: 'tag',
                title: 'دوستان (تگ)',
                onTagClick: (id: string) => console.log(`TAG: ${id}`),
            });
        }

        return table;
    }

    getData(): IData[] {
        const cities = Helper.STATE.cities;
        const getCity = (): { state: { id: string; title: string }; city: { id: string; title: string } } => {
            const city = cities[Math.floor(Math.random() * cities.length)];
            return { state: city.state, city: { id: city.id, title: city.title } };
        };

        const getBirthDay = (): Date =>
            new Date(new Date().getTime() - Math.floor(Math.random() * (365 * 30) + 365 * 18) * 24 * 3600 * 1000);
        const getWeight = (): number =>
            Math.ceil(
                Math.random() *
                    Array(Math.floor(Math.random() * 5) + 1)
                        .fill(1000)
                        .reduce((m, v) => m * v, 1),
            );
        const getTag = (): { id: string; title: string }[] => {
            const count: number = Math.random() < 0.5 ? 1 : Math.random() < 0.5 ? 2 : 3;
            const names: string[] = [...Array(count)].map(() => namesList[Math.floor(Math.random() * namesList.length)]);
            return names.map((name) => ({ id: name, title: name }));
        };

        const dataTypes: DataType[] = ['MANAGER', ...Array(5).fill('ADMIN'), ...Array(24).fill('USER')];
        const statusList: ('ACTIVE' | 'DEACTIVE')[] = [...Array(5).fill('ACTIVE'), 'DEACTIVE'];

        return Array(Math.floor(Math.random() * 5000))
            .fill('')
            .map(() => {
                const name: string = namesList[Math.floor(Math.random() * namesList.length)];
                const birthDay: Date | undefined = Math.random() > 0.3 ? getBirthDay() : undefined;
                const ageYear: number | undefined = birthDay
                    ? Math.floor((new Date().getTime() - birthDay.getTime()) / (365 * 24 * 3600 * 1000))
                    : undefined;
                const description: string | null | undefined =
                    Math.random() > 0.9
                        ? `این توضیحات در ارتباط با کاریر "${name}" در سیستم ثبت شده است.`
                        : Math.random() > 0.5
                        ? null
                        : undefined;

                return {
                    type: dataTypes[Math.floor(Math.random() * dataTypes.length)],
                    name,
                    mobile: `09${Helper.STRING.getRandom(9, 'numeric')}`,
                    birthDay,
                    ageYear,
                    ageDay: { from: birthDay },
                    educationPeriod:
                        Math.random() > 0.5
                            ? {
                                  from: new Date(),
                                  to: new Date(new Date().getTime() - Math.floor(Math.random() * 2000) * 24 * 3600 * 1000),
                              }
                            : undefined,
                    birthPlace: Math.random() > 0.1 ? getCity() : undefined,
                    fileSize: Math.random() > 0.5 ? Math.ceil(Math.random() * 1024 * 1024) : undefined,
                    weight: Math.random() > 0.5 ? getWeight() : undefined,
                    tag: Math.random() > 0.5 ? getTag() : undefined,
                    description,
                    status: statusList[Math.floor(Math.random() * statusList.length)],
                };
            });
    }

    getPagination(total: number, page: number): INgxTablePagination {
        const perPage: number = 25;
        const pages: number = Math.ceil(total / perPage);

        if (page < 1) page = 1;
        else if (page > pages) page = pages;

        return {
            item: { perPage, total },
            page: { current: page, total: pages },
        };
    }

    filtereData(list: IData[], filter: INgxTableFilter): IData[] {
        return list.filter((data) => {
            // TYPE
            if (filter.filter['type']) {
                if (data.type !== filter.filter['type'].value) return false;
            }

            // NAME
            if (filter.filter['name']) {
                const words: string[] = filter.filter['name'].value.query.split(' ').filter((word: string) => word !== '');
                switch (filter.filter['name'].value.mode) {
                    case 'PHRASE':
                        if (data.name.indexOf(words.join(' ')) === -1) return false;
                        break;
                    case 'ALL':
                        const all: boolean[] = words.map((word) => data.name.indexOf(word) !== -1);
                        if (all.includes(false)) return false;
                        break;
                    case 'EACH':
                        const each: boolean[] = words.map((word) => data.name.indexOf(word) !== -1);
                        if (!each.includes(true)) return false;
                        break;
                }
            }

            // MOBILE
            if (filter.filter['mobile']) {
                if (data.mobile.indexOf(filter.filter['mobile'].value.query) === -1) return false;
            }

            // BIRTH DAY
            if (filter.filter['birthDay']) {
                if (!data.birthDay) return false;
                const jalali = JalaliDateTime();

                const birthDay: number = data.birthDay.getTime();
                const { from, to } = jalali.periodDay(1, filter.filter['birthDay'].value);
                if (birthDay < from.getTime() || birthDay > to.getTime()) return false;
            }

            // AGE
            if (filter.filter['age']) {
                if (!data.ageYear) return false;

                switch (filter.filter['age'].value.mode) {
                    case 'EQUAL':
                        const equal: number = +filter.filter['age'].value.query;
                        if (data.ageYear !== equal) return false;
                        break;
                    case 'LESS':
                        const less: number = +filter.filter['age'].value.query;
                        if (data.ageYear >= less) return false;
                        break;
                    case 'GREATER':
                        const greater: number = +filter.filter['age'].value.query;
                        if (data.ageYear <= greater) return false;
                        break;
                    case 'BETWEEN':
                        const [from, to] = filter.filter['age'].value.query.split(':').map((q: string) => +q);
                        if (data.ageYear < from || data.ageYear > to) return false;
                        break;
                }
            }

            // STATE
            if (filter.filter['state']) {
                if (!data.birthPlace) return false;

                const states: string[] = filter.filter['state'].value;
                if (!states.includes(data.birthPlace.state.id)) return false;
            }

            // STATUS
            if (filter.filter['status']) {
                if (data.status !== filter.filter['status'].value) return false;
            }

            return true;
        });
    }

    orderList(list: IData[], filter: INgxTableFilter): IData[] {
        if (!filter.order) return list;

        switch (filter.order.id) {
            case 'type':
                list = list.sort(
                    (d1, d2) => DataInfo[d1.type].order - DataInfo[d2.type].order || d1.name.localeCompare(d2.name),
                );
                break;
            case 'name':
                switch (filter.order.type) {
                    case 'ASC':
                        list = list.sort((d1, d2) => d1.name.localeCompare(d2.name));
                        break;
                    case 'DESC':
                        list = list.sort((d1, d2) => d2.name.localeCompare(d1.name));
                        break;
                }
                break;
            case 'birthDay':
                switch (filter.order.type) {
                    case 'ASC':
                        list = list.sort((d1, d2) => (d1.birthDay?.getTime() || 0) - (d2.birthDay?.getTime() || 0));
                        break;
                    case 'DESC':
                        list = list.sort((d1, d2) => (d2.birthDay?.getTime() || 0) - (d1.birthDay?.getTime() || 0));
                        break;
                }
                break;
            case 'state':
                list = list.sort(
                    (d1, d2) =>
                        (d1.birthPlace?.state.title || '').localeCompare(d2.birthPlace?.state.title || '') ||
                        (d1.birthPlace?.city.title || '').localeCompare(d2.birthPlace?.city.title || '') ||
                        d1.name.localeCompare(d2.name),
                );
                break;
        }

        return list;
    }
}
