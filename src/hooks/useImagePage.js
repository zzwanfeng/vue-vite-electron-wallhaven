import { ref } from 'vue'
import ajax from "@/utils/request";
import { objToUrl } from "@/utils/util";
//数据查询
export default function () {
  let skeleton = ref(true)
  let page = 1
  let isLoading = ref(false)
  let list = ref([])
  let total = ref(0)
  let search = {}

  const next = () => {
    getlist(search);
  }

  const handleSearch = (data) => {
    if (!isLoading.value) {
      page = 1
      const newSearch = { ...search, ...data }
      getlist(newSearch)
    }
  }

  const getlist = (value) => {
    search = value

    if (!isLoading.value) {
      isLoading.value = true;

      ajax(`search?${objToUrl(search)}&page=${page++}`)
        .then(res => {
          isLoading.value = false;
          let { data, meta } = res;

          if (page === 2) {
            list.value = Object.freeze(data)
          } else {
            list.value = Object.freeze(list.value.concat(...data));
          }

          total.value = meta.total;

          skeleton.value = false;
        }).catch(() => {
          isLoading.value = false;
          skeleton.value = false;
        });
    }
  }


  return {
    skeleton,
    page,
    isLoading,
    list,
    total,
    next,
    handleSearch,
    getlist,
  }
}