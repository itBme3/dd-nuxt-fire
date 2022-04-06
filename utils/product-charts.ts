export const duplicateChart = (chartDoc: { [key: string]: any }, $db: any) => {
      try {
            chartDoc.chart = `${chartDoc.chart} (copy)`
            delete chartDoc.docId
            delete chartDoc.docPath
            console.log({ chartDoc })
            return $db.updateAt('size_charts', chartDoc)
                  .then((res:any) => {
                        console.log(res);
                        window.open(`/products/size-charts/${res.docId}`, '_blank')
                  })
                  .catch((err:any) => { throw err })
      } catch (errs) {
            console.error(errs)
            alert(errs);
      }
}

export const deleteChart = async (docId:String, $db:any, $router:any = false) => {
      try {
            await $db.delete(`size_charts/${docId}`)
            if ($router) {
                  $router.push('/products/size-charts')
            }
      } catch (err) {
            alert(err)
      }
}