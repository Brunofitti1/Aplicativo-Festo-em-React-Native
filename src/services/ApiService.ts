import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ApiService {
    private baseURL: string = 'http://localhost:8080';

    async init() {
        const savedURL = await AsyncStorage.getItem('apiURL');
        if (savedURL) {
            this.baseURL = savedURL;
        }
    }

    async updateBaseURL(url: string) {
        this.baseURL = url;
        await AsyncStorage.setItem('apiURL', url);
    }

    async getBaseURL(): Promise<string> {
        const savedURL = await AsyncStorage.getItem('apiURL');
        return savedURL || this.baseURL;
    }

    async getSensores() {
        const baseURL = await this.getBaseURL();
        const response = await axios.get(`${baseURL}/api/sensores`);
        return response.data;
    }

    async getAllReadings() {
        const baseURL = await this.getBaseURL();
        const response = await axios.get(`${baseURL}/api/readings`);
        return response.data;
    }

    async getSensorReadings(sensorId: string) {
        const baseURL = await this.getBaseURL();
        const response = await axios.get(`${baseURL}/api/readings/${sensorId}`);
        return response.data;
    }

    async createReading(sensorId: string, value: number) {
        const baseURL = await this.getBaseURL();
        const reading = {
            sensorId,
            value,
            timestamp: new Date().toISOString()
        };
        const response = await axios.post(`${baseURL}/api/readings`, reading);
        return response.data;
    }

    async testConnection(): Promise<{ success: boolean; message: string; count?: number }> {
        try {
            const baseURL = await this.getBaseURL();
            const response = await axios.get(`${baseURL}/api/sensores`);
            
            if (Array.isArray(response.data)) {
                return {
                    success: true,
                    message: 'Conexão estabelecida com sucesso!',
                    count: response.data.length
                };
            } else {
                return {
                    success: false,
                    message: 'API respondeu, mas com formato inesperado'
                };
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Erro desconhecido na conexão'
            };
        }
    }
}

export default new ApiService();