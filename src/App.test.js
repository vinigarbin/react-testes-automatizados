import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react'
import App, { calcularNovoSaldo } from './App';
import api from './api';

jest.mock('./api');

describe('Componente Principal', () => {
    describe('Quando eu abro o app do banco', () => {

        it('o nome é exibido', () => {
            render(<App />);
            expect(screen.getByText('ByteBank')).toBeInTheDocument();
        })

        it('o saldo é exibido', () => {
            render(<App />);
            expect(screen.getByText('Saldo:')).toBeInTheDocument();
        })

        it('o botão de realizar transação é exibido', () => {
            render(<App />);
            expect(screen.getByText('Realizar operação')).toBeInTheDocument();
        })
    })

    describe('Quando eu realizo uma transação', () => {
        it('que é um saque, o valor vai diminuir', () => {
            const valores = { transação: 'saque', valor: 50 };
            const novoSaldo = calcularNovoSaldo(valores, 150);

            expect(novoSaldo).toBe(100)
        })

        it('que é um saque, a transação deve ser realizada', () => {
            render(<App />);

            const saldo = screen.getByText('R$ 1000');
            const transacao = screen.getByLabelText('Saque');
            const valor = screen.getByTestId('valor')
            const botaoTransacao = screen.getByText('Realizar operação')

            expect(saldo.textContent).toBe('R$ 1000');

            fireEvent.click(transacao, { target: { value: 'saque' } });
            fireEvent.change(valor, { target: { value: 10 } })
            fireEvent.click(botaoTransacao);
            expect(saldo.textContent).toBe('R$ 990')
        })

    })

    describe('Requisicoes da api', () => {
        it('Exibir lista de transações através da API', async () => {
            await api.listaTransacoes.mockResolvedValue([{
                "valor": '10',
                "transacao": "saque",
                "data": "10/08/2020",
                "id": 1
            },
            {
                "transacao": "deposito",
                "valor": '20',
                "data": "26/09/2020",
                "id": 2
            }]);

            render(<App />);

            expect(await screen.findByText('saque')).toBeInTheDocument();
            expect(screen.getByTestId('transacoes').children.length).toBe(2);
        })
    })
})


