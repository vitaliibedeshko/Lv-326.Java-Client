import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Board} from '../../entity/Board';
import {Observable} from 'rxjs';
import {List} from '../../entity/List';
import {Ticket} from '../../entity/Ticket';
import {HistoryLog} from '../../entity/HistoryLog';
import {Log} from '@angular/core/testing/src/logger';
import {OrderTableList} from '../../entity/OrderTableList';


@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private simpleUrl = '/api/boards/';

  private orderTableList: OrderTableList;

  constructor(private http: HttpClient) {
  }

  createHttpOptions() {
    const headers = JSON.parse(localStorage.getItem('appHeaders'));
    return {headers: new HttpHeaders(headers)};
  }

  getBoard(id: number): Observable<Board> {
    const url = `${this.simpleUrl}${id}`;
    return this.http.get<Board>(url, this.createHttpOptions());
  }

  addList(boardId: number, list: List): Observable<List> {
    const url = `/api/lists/board/${boardId}`;
    return this.http.post<List>(url, list, this.createHttpOptions());
  }

  deleteList(id: number): Observable<List> {
    const url = `/api/lists/${id}`;
    return this.http.delete<List>(url, this.createHttpOptions());
  }

  editList(list: List): Observable<List> {
    const url = `/api/lists/${list.id}/board/${list.boardId}`;
    return this.http.put<List>(url, list, this.createHttpOptions());
  }

  editBoard(newName: string, board: Board): Observable<Board> {
    board.name = newName;
    const url = `/api/boards/${board.id}`;
    return this.http.put<Board>(url, board, this.createHttpOptions());
  }

  addTicket(ticket: Ticket): Observable<Ticket> {
    const url = `/api/tickets`;
    return this.http.post<Ticket>(url, ticket, this.createHttpOptions());
  }

  createLog(historyLog: HistoryLog): Observable<HistoryLog> {
    const url = '/api/log';
    return this.http.post<HistoryLog>(url, historyLog, this.createHttpOptions());
  }

  getMoreLogs(lastLogId: number, boardId: number): Observable<HistoryLog[]> {
    const url = `/api/log/${boardId}/${lastLogId}`;
    return this.http.get<HistoryLog[]>(url, this.createHttpOptions());
  }

  saveBackgroundImage(board: Board, base64Image: string, imageName: string) {
    const url = `/api/boards/image`;
    board.image = base64Image;
    board.imageName = imageName;
    return this.http.put(url, board, this.createHttpOptions());
  }

  updateListOrder(boardId: number, listId: string, sequenceNumber: number) {
    listId = listId.split('list')[1];
    this.createOrderTableList(boardId, listId, sequenceNumber);
    const url = `/api/lists/order`;
    this.http.put(url, this.orderTableList, this.createHttpOptions()).subscribe();
  }

  createOrderTableList(boardId: number, listId: string, sequenceNumber: number) {
    this.orderTableList = {
      boardId: boardId,
      listId: listId,
      sequenceNumber: sequenceNumber
    };
  }

  getExistingImagesUrls(boardId: number): Observable<string[]> {
    const url = `/api/boards/images/${boardId}`;
    return this.http.get<string[]>(url, this.createHttpOptions());
  }

  setExistingImageOnBackground(imageUrl: string, boardId: number) {
    const url = `/api/boards/images/${boardId}`;
    this.http.put(url, imageUrl, this.createHttpOptions()).subscribe();
  }

  clearBoardBackground(boardId: number) {
    const url = `/api/boards/images/${boardId}`;
    this.http.delete(url, this.createHttpOptions()).subscribe();
  }
}

