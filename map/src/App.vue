<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input
        type="text"
        v-model="searchHospital"
        placeholder="Search by hospital or city"
      />
      <button type="submit">Search</button>
    </form>
    <GoogleMap
      api-key="your_google_api_key"
      style="width: 100%; height: 400px"
      :zoom="5"
      :center="center"
    >
      <MarkerCluster>
        <Marker
          v-for="(hospital, i) in hospitals"
          :key="i"
          :options="{ position: hospital.longLat }"
        >
          <InfoWindow>
            <div>
              <h1>{{ hospital.name }}</h1>
              <p>{{ hospital.address }}</p>
              <span>{{ hospital.region }}</span>
              <p>{{ hospital.phone ?? "-" }}</p>
            </div>
          </InfoWindow>
        </Marker>
      </MarkerCluster>
    </GoogleMap>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { GoogleMap, Marker, MarkerCluster, InfoWindow } from "vue3-google-map";
import axios from "axios";
import hospitalApi from "../data/api.json";

export default defineComponent({
  components: { GoogleMap, Marker, MarkerCluster, InfoWindow },
  data() {
    return {
      center: { lat: -2.5489, lng: 118.0149 },
      hospitals: [],
      infoWindowOptions: {
        maxWidth: 200,
      },
      searchHospital: "",
    };
  },
  mounted() {
    this.fetchHospitals();
  },
  methods: {
    async fetchHospitals() {
      for (const hospital of hospitalApi) {
        try {
          const { data } = await axios.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            {
              params: {
                address: hospital.address,
                key: process.env.VUE_APP_GOOGLE_API_KEY,
              },
            }
          );
          const longLat = data.results[0].geometry.location;
          this.hospitals.push({ ...hospital, longLat });
        } catch (err) {
          console.log(err, "fetch hospital");
        }
      }
    },

    showInfo(hospital) {
      this.selectedHospital = hospital;
      this.$refs.infoWindow.open();
    },
    hideInfo() {
      this.selectedHospital = null;
      this.$refs.infoWindow.close();
    },
    async handleSubmit() {
      if (!this.searchHospital) {
        return;
      }
      try {
        const { data } = await axios.get(
          "https://maps.googleapis.com/maps/api/geocode/json",
          {
            params: {
              key: process.env.VUE_APP_GOOGLE_API_KEY,
              address: this.searchHospital,
            },
          }
        );
        const searchLonglat = data.results[0].geometry.location;
        this.center = searchLonglat;

        this.hospitals = [];

        if (searchLonglat) {
          this.hospitals.push({
            name: this.searchHospital,
            address: this.searchHospital,
            longLat: searchLonglat,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
});
</script>
