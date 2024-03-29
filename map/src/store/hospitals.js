import {defineStore} from 'pinia'
import axios from 'axios'

export const useHospitalStore = defineStore('hospitals', {
    state:  () => ({
        hospitals : [],
        baseUrl : 'https://dekontaminasi.com/api/id/covid19/hospitals'
    }),
    actions: {
        async fetchHospital(){
            try {
              const {data} = await axios({
                method : "GET",
                baseURL : this.baseUrl
              })
              this.hospitals = data
            } catch (err) {
               console.log(err) 
            }
        }
    }
})